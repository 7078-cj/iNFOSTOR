import { Loader2 } from "lucide-react";

/*
|--------------------------------------------------------------------------
| Button
|--------------------------------------------------------------------------
| Every state is designed, not just the happy path:
|
|   default    resting
|   hover      lifts one step in tone
|   active     presses down 1px — physical feedback, 90ms
|   focus      visible ring, keyboard only
|   disabled   drops to the overlay surface rather than fading to 40%
|              opacity. Faded text on a dark ground fails contrast; a
|              flatter surface reads as "not now" while staying readable.
|   loading    keeps the button's exact footprint and swaps the label for a
|              spinner, so submitting a vote never reflows the layout
|              underneath the cursor.
|
| Variants map to intent rather than colour, so a screen asks for "danger"
| and gets whatever the token system currently says danger looks like.
*/

const VARIANTS = {
    primary:
        "bg-accent text-surface-world hover:bg-accent-hover active:bg-accent-active border-transparent",

    secondary:
        "bg-surface-overlay text-text-primary border-border-default hover:border-border-strong hover:bg-surface-raised active:bg-surface-sunken",

    ghost:
        "bg-transparent text-text-secondary border-transparent hover:bg-white/5 hover:text-text-primary active:bg-white/10",

    danger:
        "bg-status-danger/15 text-status-danger border-status-danger/30 hover:bg-status-danger/25 hover:border-status-danger/50 active:bg-status-danger/35",

    success:
        "bg-status-success/15 text-status-success border-status-success/30 hover:bg-status-success/25 hover:border-status-success/50 active:bg-status-success/35",
};

const SIZES = {
    sm: "px-3 py-1.5 text-2xs gap-1.5",
    md: "px-4 py-2.5 text-xs gap-2",
    lg: "px-6 py-3 text-sm gap-2.5",
};

export default function Button({
    variant = "primary",
    size = "md",
    loading = false,
    disabled = false,
    icon: Icon = null,
    iconRight = false,
    fullWidth = false,
    className = "",
    children,
    ...rest
}) {
    const isInert = disabled || loading;

    return (
        <button
            disabled={isInert}
            aria-busy={loading || undefined}
            className={[
                "inline-flex items-center justify-center rounded-md border",
                "font-semibold uppercase tracking-wider",
                "transition-[background-color,border-color,transform,box-shadow]",
                "duration-fast ease-out-quart",
                "active:translate-y-px",
                "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
                fullWidth ? "w-full" : "",
                SIZES[size],
                isInert
                    ? "cursor-not-allowed border-border-default bg-surface-overlay text-text-muted active:translate-y-0"
                    : VARIANTS[variant],
                className,
            ]
                .filter(Boolean)
                .join(" ")}
            {...rest}
        >
            {loading ? (
                <Loader2
                    size={size === "lg" ? 16 : 14}
                    className="animate-spin-slow"
                    aria-hidden="true"
                />
            ) : (
                Icon &&
                !iconRight && (
                    <Icon size={size === "lg" ? 16 : 14} aria-hidden="true" />
                )
            )}

            {children}

            {!loading && Icon && iconRight && (
                <Icon size={size === "lg" ? 16 : 14} aria-hidden="true" />
            )}
        </button>
    );
}
