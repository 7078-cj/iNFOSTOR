const PHASE_COPY = {
    waiting: {
        label: "Lobby",
        hint: "Waiting for the host to start the game.",
        color: "text-slate-400",
    },
    investigation: {
        label: "Investigation",
        hint: "Explore the map, gather evidence (E), then call a vote when ready.",
        color: "text-sky-400",
    },
    discussion: {
        label: "Discussion",
        hint: "Share your findings before voting begins.",
        color: "text-amber-400",
    },
    consensus: {
        label: "Voting",
        hint: "Cast your verdict on the announcement.",
        color: "text-red-400",
    },
    result: {
        label: "Round Result",
        hint: "Review the outcome, then continue to the next round.",
        color: "text-emerald-400",
    },
    finished: {
        label: "Game Over",
        hint: "",
        color: "text-violet-400",
    },
};

export default function PhaseBanner({
    phase,
    round,
    discussionSecondsLeft,
    evidenceCount,
}) {
    const copy = PHASE_COPY[phase] || PHASE_COPY.investigation;

    return (
        <div className="absolute bottom-6 left-6 z-10 max-w-xs rounded border border-white/10 bg-black/75 p-3 text-xs">
            <div className="mb-1 flex items-center gap-2">
                {round > 0 && (
                    <span className="rounded bg-white/10 px-1.5 py-0.5 text-[10px] uppercase tracking-wide text-slate-400">
                        Round {round}
                    </span>
                )}
                <span
                    className={`font-semibold uppercase tracking-wide ${copy.color}`}
                >
                    {copy.label}
                </span>
            </div>

            {copy.hint && (
                <p className="leading-relaxed text-slate-400">{copy.hint}</p>
            )}

            {phase === "discussion" && discussionSecondsLeft != null && (
                <div className="mt-2 font-mono text-sm text-amber-300">
                    Vote opens in {discussionSecondsLeft}s
                </div>
            )}

            {phase === "investigation" && evidenceCount != null && (
                <div className="mt-2 text-slate-500">
                    Evidence logged: {evidenceCount}
                </div>
            )}
        </div>
    );
}
