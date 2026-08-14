/*
|--------------------------------------------------------------------------
| Card / Panel / Surface primitives
|--------------------------------------------------------------------------
| The elevation rule in one place: cards sit on `raised` at e1, panels that
| float over the game world sit on an alpha ground at e3, and everything
| takes radius-lg. Screens ask for a surface by role rather than restating
| border/background/shadow triples.
*/

const TONES = {
    /* Standard content card on a page. */
    card: "bg-surface-raised border-border-default shadow-e1",

    /* Floating HUD panel over the game world — needs the blur to stay
       legible against whatever map detail is behind it. */
    hud: "bg-surface-base/85 border-border-default shadow-e3 backdrop-blur-md",

    /* Recessed well: evidence logs, scroll areas. */
    sunken: "bg-surface-sunken border-border-subtle shadow-inset",

    /* Empty / placeholder states. */
    dashed: "bg-surface-raised/50 border-border-default border-dashed",
};

export default function Card({
    tone = "card",
    accent = null,
    interactive = false,
    className = "",
    style,
    children,
    ...rest
}) {
    return (
        <div
            className={[
                "rounded-lg border",
                TONES[tone],
                accent ? "border-l-[3px]" : "",
                interactive
                    ? "transition-[transform,border-color,box-shadow] duration-fast ease-out-quart hover:-translate-y-0.5 hover:border-border-strong hover:shadow-e2"
                    : "",
                className,
            ]
                .filter(Boolean)
                .join(" ")}
            style={{
                ...(accent ? { borderLeftColor: accent } : null),
                ...style,
            }}
            {...rest}
        >
            {children}
        </div>
    );
}

/*
| Section heading used inside cards and panels — keeps the label treatment
| identical everywhere instead of each screen inventing its own.
*/

export function CardLabel({ children, className = "", ...rest }) {
    return (
        <div
            className={`text-2xs font-medium uppercase tracking-wider text-text-muted ${className}`}
            {...rest}
        >
            {children}
        </div>
    );
}
