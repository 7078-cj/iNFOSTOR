import { useState } from "react";
import {
    ChallengeBanner,
    CloseButton,
} from "./shared";

export default function ComputerView({
    content,
    objectLabel,
    isArchive = false,
    challenge,
    relevantToPlayer,
    onSubmitEvidence,
    onClose,
}) {
    const [query, setQuery] = useState("");
    const [searching, setSearching] = useState(false);
    const [showResults, setShowResults] = useState(false);

    function handleSearch(e) {
        e.preventDefault();
        if (!query.trim()) return;

        setSearching(true);
        setShowResults(false);

        setTimeout(() => {
            setSearching(false);
            setShowResults(true);
        }, 700);
    }

    return (
        <div className="overflow-hidden rounded-2xl border border-neutral-600 bg-neutral-900 shadow-2xl">
            {/* Browser chrome */}
            <div className="border-b border-neutral-700 bg-neutral-800">
                <div className="flex items-center gap-2 px-3 py-2">
                    <div className="flex gap-1.5">
                        <div className="h-3 w-3 rounded-full bg-red-500" />
                        <div className="h-3 w-3 rounded-full bg-yellow-500" />
                        <div className="h-3 w-3 rounded-full bg-green-500" />
                    </div>
                    <div className="flex-1 rounded-md bg-neutral-950 px-3 py-1 text-[11px] text-slate-400">
                        🔒{" "}
                        {isArchive
                            ? "archive.municipal.gov/search"
                            : "search.municipal-web.ph"}
                    </div>
                    <CloseButton onClose={onClose} />
                </div>

                <div className="flex gap-1 border-t border-neutral-700 px-3 py-1">
                    <div className="rounded-t bg-neutral-900 px-3 py-1 text-[10px] text-slate-300">
                        Search
                    </div>
                    <div className="px-3 py-1 text-[10px] text-slate-600">
                        History
                    </div>
                </div>
            </div>

            <div className="p-4">
                <ChallengeBanner
                    challenge={challenge}
                    relevantToPlayer={relevantToPlayer}
                />

                <div className="mb-1 text-xs font-medium text-slate-400">
                    {objectLabel}
                    {isArchive && (
                        <span className="ml-2 rounded bg-violet-900/50 px-1.5 py-0.5 text-[10px] text-violet-300">
                            Archive Terminal
                        </span>
                    )}
                </div>

                <form onSubmit={handleSearch} className="mb-4 flex gap-2">
                    <input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search for information about the announcement…"
                        className="flex-1 rounded-lg border border-neutral-600 bg-neutral-950 px-3 py-2.5 text-sm text-slate-100 outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                    />
                    <button
                        type="submit"
                        className="rounded-lg bg-sky-600 px-4 py-2.5 text-sm font-medium hover:bg-sky-500"
                    >
                        Search
                    </button>
                </form>

                {searching && (
                    <div className="flex items-center gap-3 rounded-lg border border-neutral-700 bg-neutral-950 p-4 text-sm text-slate-400">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-sky-500 border-t-transparent" />
                        Searching the web…
                    </div>
                )}

                {!searching && !showResults && (
                    <div className="rounded-lg border border-dashed border-neutral-700 bg-neutral-950/50 p-6 text-center text-sm text-slate-500">
                        Type a keyword related to the announcement and press
                        Search to find web results.
                    </div>
                )}

                {!searching && showResults && (
                    <div className="space-y-1">
                        <div className="mb-2 text-xs text-slate-500">
                            About {(content.searchResults?.length || 0) * 12400}{" "}
                            results (0.42 seconds)
                        </div>

                        <ul className="space-y-3">
                            {content.searchResults.map((result, idx) => (
                                <li
                                    key={idx}
                                    className="rounded-lg border border-neutral-700/50 bg-neutral-950/60 p-3 transition-colors hover:border-sky-700/50"
                                >
                                    <div className="mb-0.5 text-[10px] text-emerald-600">
                                        www.{result.title
                                            .slice(0, 20)
                                            .toLowerCase()
                                            .replace(/\s+/g, "-")}
                                        .gov.ph
                                    </div>
                                    <div className="mb-1 text-sm font-medium text-sky-400 hover:underline">
                                        {result.title}
                                    </div>
                                    <p className="mb-2 text-xs leading-relaxed text-slate-400">
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
                                        className="rounded bg-emerald-800/80 px-2.5 py-1 text-[11px] font-medium hover:bg-emerald-700"
                                    >
                                        Log this result
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                <div className="mt-3 rounded-lg border border-amber-900/30 bg-amber-950/20 px-3 py-2 text-[11px] text-amber-300/70">
                    Tip: Web results mix reliable and unreliable sources. Check
                    who published each result before trusting it.
                </div>
            </div>
        </div>
    );
}
