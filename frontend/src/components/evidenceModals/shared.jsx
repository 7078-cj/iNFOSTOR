export function ModalBackdrop({ onClose, children, className = "" }) {
    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
            onClick={onClose}
        >
            <div
                className={`w-full max-w-lg ${className}`}
                onClick={(e) => e.stopPropagation()}
            >
                {children}
            </div>
        </div>
    );
}

export function ChallengeBanner({ challenge, relevantToPlayer }) {
    return (
        <>
            {challenge && (
                <div className="mb-3 rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-xs text-slate-400">
                    <span className="font-semibold text-slate-200">
                        Your task:{" "}
                    </span>
                    {challenge.title ? `${challenge.title} — ` : ""}
                    {challenge.instructions}
                </div>
            )}

            {relevantToPlayer && (
                <div className="mb-3 rounded-lg border border-emerald-500/30 bg-emerald-950/40 px-3 py-1.5 text-[11px] font-medium uppercase tracking-wide text-emerald-300">
                    Relevant to your role
                </div>
            )}
        </>
    );
}

export function LogEvidenceButton({ onClick, label = "Log as evidence", variant = "emerald" }) {
    const styles = {
        emerald: "bg-emerald-700 hover:bg-emerald-600",
        red: "bg-red-800 hover:bg-red-700",
        amber: "bg-amber-700 hover:bg-amber-600",
        sky: "bg-sky-700 hover:bg-sky-600",
    };

    return (
        <button
            onClick={onClick}
            className={`mt-4 w-full rounded-lg px-4 py-2.5 text-sm font-semibold uppercase tracking-wide text-white transition-colors ${styles[variant] || styles.emerald}`}
        >
            {label}
        </button>
    );
}

export function CloseButton({ onClose, className = "" }) {
    return (
        <button
            onClick={onClose}
            className={`rounded-lg px-2 py-1 text-slate-400 transition-colors hover:bg-white/10 hover:text-white ${className}`}
            aria-label="Close"
        >
            ✕
        </button>
    );
}

export function EmptySourceMessage() {
    return (
        <div className="rounded-lg border border-dashed border-white/20 bg-black/20 p-6 text-center text-sm text-slate-400">
            Nothing useful here for this announcement.
        </div>
    );
}
