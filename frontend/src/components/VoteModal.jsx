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
                    Is this announcement misinformation?
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
                                : entry.evidence?.summary ||
                                  JSON.stringify(entry.evidence)}
                        </div>
                    ))}
                </div>

                <div className="mb-3 flex gap-2">
                    <button
                        onClick={() => onVote("FLAG")}
                        disabled={!!myVote}
                        className={`flex-1 rounded px-3 py-2 text-xs font-medium uppercase tracking-wide transition-colors ${
                            myVote === "FLAG"
                                ? "bg-red-600 ring-2 ring-red-300"
                                : "bg-red-700 hover:bg-red-600"
                        } ${myVote && myVote !== "FLAG" ? "opacity-40" : ""}`}
                    >
                        Flag as Misinformation
                    </button>

                    <button
                        onClick={() => onVote("CONTINUE_INVESTIGATION")}
                        disabled={!!myVote}
                        className={`flex-1 rounded px-3 py-2 text-xs font-medium uppercase tracking-wide transition-colors ${
                            myVote === "CONTINUE_INVESTIGATION"
                                ? "bg-slate-500 ring-2 ring-slate-300"
                                : "bg-slate-700 hover:bg-slate-600"
                        } ${
                            myVote && myVote !== "CONTINUE_INVESTIGATION"
                                ? "opacity-40"
                                : ""
                        }`}
                    >
                        Keep Investigating
                    </button>
                </div>

                <div className="text-center text-[11px] text-slate-500">
                    {myVote
                        ? "Waiting for other players… "
                        : "Cast your vote — "}
                    {votesCast}/{totalPlayers} voted
                    {totalPlayers === 2 && (
                        <div className="mt-1 text-slate-600">
                            With 2 players, both must agree to flag.
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}