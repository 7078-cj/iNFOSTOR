/** Briefing terminal sprite for the central plaza hub. */

export default function BriefingTerminal({ active = false }) {
    return (
        <div className="relative h-full w-full">
            <div
                className={`absolute inset-0 rounded-full border-2 ${
                    active
                        ? "border-emerald-400/60 shadow-[0_0_24px_8px_rgba(94,230,168,0.35)]"
                        : "border-emerald-500/20 shadow-[0_0_12px_4px_rgba(94,230,168,0.15)]"
                }`}
                style={{
                    background:
                        "radial-gradient(circle, rgba(94,230,168,0.2) 0%, rgba(16,185,129,0.05) 60%, transparent 100%)",
                }}
            />
            <div
                className={`absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full ${
                    active ? "bg-emerald-300 animate-pulse" : "bg-emerald-400/80"
                }`}
            />
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap text-[8px] uppercase tracking-wider text-emerald-400/50">
                Hub
            </div>
        </div>
    );
}
