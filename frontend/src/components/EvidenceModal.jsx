import { useState } from "react";
import investigationContent from "../data/investigationContent";

const OBJECT_LABELS = {
    library: "Library",
    tv: "TV",
    bulletin: "Noticeboard",
    radio: "Radio",
    computer: "Computer",
};

/**
 * objectId: "library" | "tv" | "bulletin" | "radio" | "computer"
 * announcementId: current round's announcement.id from game state
 * challenge: { title, instructions } for the local player (from game state)
 * playerRole: the local player's role string (e.g. "Data Analyst"), used
 *             only to show a soft "relevant to you" hint — never reveals
 *             whether the source is trustworthy.
 * onClose: () => void
 * onSubmitEvidence: (evidenceText: string) => void  -> sends `submit_evidence`
 */
export default function EvidenceModal({
    objectId,
    announcementId,
    challenge,
    playerRole,
    onClose,
    onSubmitEvidence,
}) {
    if (!objectId) return null;

    const content = investigationContent[announcementId]?.[objectId];

    const relevantToPlayer =
        playerRole &&
        content?.bestFor?.includes(playerRole);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
            <div className="w-full max-w-lg rounded-lg border border-white/10 bg-neutral-900 p-5 text-slate-100 shadow-xl">
                <div className="mb-3 flex items-center justify-between">
                    <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-300">
                        {OBJECT_LABELS[objectId] || objectId}
                    </h2>

                    <button
                        onClick={onClose}
                        className="rounded px-2 py-1 text-slate-400 hover:bg-white/10 hover:text-white"
                    >
                        ✕
                    </button>
                </div>

                {challenge && (
                    <div className="mb-2 rounded bg-white/5 p-2 text-xs text-slate-400">
                        <span className="font-semibold text-slate-300">
                            Your task:{" "}
                        </span>
                        {challenge.title ? `${challenge.title} — ` : ""}
                        {challenge.instructions}
                    </div>
                )}

                {relevantToPlayer && (
                    <div className="mb-4 rounded bg-emerald-900/40 px-2 py-1 text-[11px] font-medium uppercase tracking-wide text-emerald-300">
                        This looks worth checking for your role
                    </div>
                )}

                {!content && (
                    <p className="text-sm text-slate-400">
                        Nothing useful here for this announcement.
                    </p>
                )}

                {content && objectId === "library" && (
                    <PassageContent
                        title={content.title}
                        text={content.passage}
                        source="library"
                        onSubmitEvidence={onSubmitEvidence}
                        onClose={onClose}
                    />
                )}

                {content && objectId === "tv" && (
                    <BroadcastContent
                        title={content.title}
                        text={content.broadcast}
                        source="tv"
                        mono
                        onSubmitEvidence={onSubmitEvidence}
                        onClose={onClose}
                    />
                )}

                {content && objectId === "bulletin" && (
                    <PassageContent
                        title={content.title}
                        text={content.notice}
                        source="bulletin"
                        onSubmitEvidence={onSubmitEvidence}
                        onClose={onClose}
                    />
                )}

                {content && objectId === "radio" && (
                    <BroadcastContent
                        title={content.title}
                        text={content.broadcast}
                        source="radio"
                        onSubmitEvidence={onSubmitEvidence}
                        onClose={onClose}
                    />
                )}

                {content && objectId === "computer" && (
                    <ComputerContent
                        content={content}
                        onSubmitEvidence={onSubmitEvidence}
                        onClose={onClose}
                    />
                )}
            </div>
        </div>
    );
}

function PassageContent({ title, text, source, onSubmitEvidence, onClose }) {
    return (
        <div>
            <h3 className="mb-2 text-base font-semibold">{title}</h3>
            <p className="mb-4 text-sm leading-relaxed text-slate-300">
                {text}
            </p>

            <SubmitEvidenceButton
                onClick={() => {
                    onSubmitEvidence({ source, note: text });
                    onClose();
                }}
            />
        </div>
    );
}

function BroadcastContent({
    title,
    text,
    source,
    mono = false,
    onSubmitEvidence,
    onClose,
}) {
    return (
        <div>
            <h3 className="mb-2 text-base font-semibold">{title}</h3>

            <div
                className={`mb-4 rounded border border-white/10 bg-black p-3 text-sm ${
                    mono
                        ? "font-mono text-green-400"
                        : "text-amber-300"
                }`}
            >
                {text}
            </div>

            <SubmitEvidenceButton
                onClick={() => {
                    onSubmitEvidence({ source, note: text });
                    onClose();
                }}
            />
        </div>
    );
}

function ComputerContent({ content, onSubmitEvidence, onClose }) {
    const [query, setQuery] = useState("");
    const [searching, setSearching] = useState(false);
    const [showResults, setShowResults] = useState(false);

    function handleSearch(e) {
        e.preventDefault();

        if (!query.trim()) return;

        setSearching(true);
        setShowResults(false);

        // Simulate network latency so it feels like a real search.
        setTimeout(() => {
            setSearching(false);
            setShowResults(true);
        }, 700);
    }

    return (
        <div>
            <form onSubmit={handleSearch} className="mb-3 flex gap-2">
                <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search the web…"
                    className="flex-1 rounded border border-white/10 bg-neutral-800 px-3 py-2 text-sm text-slate-100 outline-none focus:border-sky-500"
                />
                <button
                    type="submit"
                    className="rounded bg-sky-600 px-3 py-2 text-sm font-medium hover:bg-sky-500"
                >
                    Search
                </button>
            </form>

            {searching && (
                <p className="text-sm text-slate-400">Searching…</p>
            )}

            {!searching && !showResults && (
                <p className="text-sm text-slate-500">
                    Type something related to the announcement and hit
                    search.
                </p>
            )}

            {!searching && showResults && (
                <ul className="space-y-3">
                    {content.searchResults.map((result, idx) => (
                        <li
                            key={idx}
                            className="rounded border border-white/10 bg-neutral-800/60 p-3"
                        >
                            <div className="mb-1 text-sm font-medium text-sky-400">
                                {result.title}
                            </div>
                            <p className="mb-2 text-xs text-slate-300">
                                {result.snippet}
                            </p>
                            <button
                                onClick={() => {
                                    onSubmitEvidence({
                                        source: "computer",
                                        note: `${result.title}: ${result.snippet}`,
                                    });
                                    onClose();
                                }}
                                className="rounded bg-emerald-700 px-2 py-1 text-[11px] font-medium hover:bg-emerald-600"
                            >
                                Log as evidence
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

function SubmitEvidenceButton({ onClick }) {
    return (
        <button
            onClick={onClick}
            className="rounded bg-emerald-700 px-3 py-2 text-sm font-medium hover:bg-emerald-600"
        >
            Log as evidence
        </button>
    );
}