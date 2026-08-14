import { PHASE_ORDER, PHASES, getPhaseIndex } from "../icons/registry";

/*
|--------------------------------------------------------------------------
| PhaseRail
|--------------------------------------------------------------------------
| The round flow as a persistent rail, so a player can always answer "where
| are we?" without reading anything. Three states per step:
|
|   done      dimmed, the step's colour drained to muted
|   current   full colour, label visible, icon lit, subtle pulse
|   upcoming  outline only
|
| Steps are numbered because the round genuinely is a sequence — the
| numbering encodes real order rather than decorating the layout.
|
| On narrow screens the labels drop away and the rail collapses to icons,
| which is enough to keep orientation on a phone.
*/

export default function PhaseRail({ phase, className = "", compact = false }) {
    const activeIndex = getPhaseIndex(phase);

    return (
        <ol
            className={[
                "flex items-stretch gap-1",
                className,
            ].join(" ")}
            aria-label="Round progress"
        >
            {PHASE_ORDER.map((key, index) => {
                const { Icon, label, colorVar } = PHASES[key];

                const isCurrent = index === activeIndex;
                const isDone = activeIndex > -1 && index < activeIndex;

                return (
                    <li
                        key={key}
                        aria-current={isCurrent ? "step" : undefined}
                        className={[
                            "group relative flex min-w-0 flex-1 flex-col gap-1.5",
                            "rounded-md border px-2 py-2",
                            "transition-[background-color,border-color,opacity]",
                            "duration-slow ease-out-quart",
                            isCurrent
                                ? "border-transparent"
                                : "border-border-subtle",
                            isDone ? "opacity-45" : "",
                            !isCurrent && !isDone ? "opacity-70" : "",
                        ]
                            .filter(Boolean)
                            .join(" ")}
                        style={
                            isCurrent
                                ? {
                                      backgroundColor: `color-mix(in srgb, ${colorVar} 14%, transparent)`,
                                      borderColor: `color-mix(in srgb, ${colorVar} 40%, transparent)`,
                                  }
                                : undefined
                        }
                    >
                        {/* Progress tick along the top edge — fills for steps
                            already passed and for the current one. */}
                        <span
                            aria-hidden="true"
                            className="absolute inset-x-2 top-0 h-px rounded-full transition-colors duration-slow"
                            style={{
                                backgroundColor:
                                    isDone || isCurrent
                                        ? colorVar
                                        : "transparent",
                            }}
                        />

                        <span
                            className="flex items-center gap-1.5 transition-colors duration-slow"
                            style={{
                                color: isCurrent
                                    ? colorVar
                                    : "var(--color-text-muted)",
                            }}
                        >
                            <Icon size={compact ? 14 : 16} />

                            {!compact && (
                                <span className="text-[10px] font-medium tabular-nums opacity-70">
                                    {String(index + 1).padStart(2, "0")}
                                </span>
                            )}
                        </span>

                        {!compact && (
                            <span
                                className={[
                                    "truncate text-[10px] font-medium uppercase tracking-wide",
                                    "transition-colors duration-slow",
                                    "max-sm:hidden",
                                ].join(" ")}
                                style={{
                                    color: isCurrent
                                        ? "var(--color-text-primary)"
                                        : "var(--color-text-muted)",
                                }}
                            >
                                {label}
                            </span>
                        )}
                    </li>
                );
            })}
        </ol>
    );
}
