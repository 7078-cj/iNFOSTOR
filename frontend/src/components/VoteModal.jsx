const VOTE_OPTIONS = [
    {
        value: "TRUE",
        label: "True",
        activeClass: "bg-emerald-600 ring-2 ring-emerald-300",
        idleClass: "bg-emerald-700 hover:bg-emerald-600",
    },
    {
        value: "MISLEADING",
        label: "Misleading",
        activeClass: "bg-amber-600 ring-2 ring-amber-300",
        idleClass: "bg-amber-700 hover:bg-amber-600",
    },
    {
        value: "FALSE/HOAX",
        label: "False / Hoax",
        activeClass: "bg-red-600 ring-2 ring-red-300",
        idleClass: "bg-red-700 hover:bg-red-600",
    },
    {
        value: "OUT_OF_CONTEXT",
        label: "Out of Context",
        activeClass: "bg-purple-600 ring-2 ring-purple-300",
        idleClass: "bg-purple-700 hover:bg-purple-600",
    },
];


export default function VoteModal({
    open,
    announcement,
    evidenceLog,
    myVote,
    votesCast,
    totalPlayers,
    onVote,
}) {

    if (!open) {
        return null;
    }

    const relevantEvidence = (evidenceLog || []).filter(
        (entry) => entry.evidence
    );

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 font-mono">
            <div className="w-full max-w-md rounded border border-white/10 bg-neutral-900 p-5 text-sm text-slate-200 shadow-xl">

                <div className="mb-1 text-base font-semibold text-slate-100">
                    Time to Vote
                </div>

                <div className="mb-3 text-xs text-slate-500">
                    What's your verdict?
                </div>

                {announcement && (
                    <div className="mb-3 rounded border border-white/10 bg-black/40 p-2 text-xs">
                        <div className="mb-1 font-semibold text-slate-300">
                            {announcement.title}
                        </div>
                        <p className="leading-relaxed text-slate-400">
                            {announcement.content}
                        </p>
                    </div>
                )}

                <div className="mb-4 max-h-32 overflow-y-auto rounded border border-white/5 bg-black/20 p-2 text-xs text-slate-400">
                    <div className="mb-1 font-medium uppercase tracking-wide text-slate-500">
                        Evidence Gathered
                    </div>

                    {relevantEvidence.length === 0 && (
                        <div className="italic text-slate-600">
                            No evidence submitted yet.
                        </div>
                    )}

                    {relevantEvidence.map((entry, i) => (
                        <div key={i} className="py-0.5">
                            •{" "}
                            {typeof entry.evidence === "string"
                                ? entry.evidence
                                : entry.evidence?.note ||
                                  entry.evidence?.summary ||
                                  JSON.stringify(entry.evidence)}
                        </div>
                    ))}
                </div>

                <div className="mb-2 grid grid-cols-2 gap-2">
                    {VOTE_OPTIONS.map((option) => {

                        const isMine = myVote === option.value;

                        const isDimmed =
                            !!myVote && myVote !== option.value;

                        return (
                            <button
                                key={option.value}
                                onClick={() => onVote(option.value)}
                                disabled={!!myVote}
                                className={`rounded px-2 py-2 text-xs font-medium uppercase tracking-wide transition-colors ${
                                    isMine
                                        ? option.activeClass
                                        : option.idleClass
                                } ${isDimmed ? "opacity-40" : ""}`}
                            >
                                {option.label}
                            </button>
                        );
                    })}
                </div>

                <div className="mb-3">
                    <button
                        onClick={() => onVote("CONTINUE_INVESTIGATION")}
                        disabled={!!myVote}
                        className={`w-full rounded px-2 py-2 text-xs font-medium uppercase tracking-wide transition-colors ${
                            myVote === "CONTINUE_INVESTIGATION"
                                ? "bg-slate-500 ring-2 ring-slate-300"
                                : "bg-slate-700 hover:bg-slate-600"
                        } ${
                            myVote && myVote !== "CONTINUE_INVESTIGATION"
                                ? "opacity-40"
                                : ""
                        }`}
                    >
                        Not Yet — Keep Investigating
                    </button>
                </div>

                <div className="text-center text-[11px] text-slate-500">
                    {myVote
                        ? "Waiting for other players… "
                        : "Cast your vote — "}
                    {votesCast}/{totalPlayers} voted
                    {totalPlayers === 2 && (
                        <div className="mt-1 text-slate-600">
                            With 2 players, both must agree to resolve.
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}