import { getRoleVisual } from "../icons/registry";

/*
|--------------------------------------------------------------------------
| RoleBadge
|--------------------------------------------------------------------------
| A role's icon, colour and name in one treatment. The Imposter is the only
| role that renders differently — a dashed border — because it is the only
| role whose card should feel like it doesn't belong with the others.
*/

const SIZES = {
    sm: { box: "h-7 w-7", icon: 15, text: "text-2xs" },
    md: { box: "h-10 w-10", icon: 21, text: "text-xs" },
    lg: { box: "h-14 w-14", icon: 28, text: "text-sm" },
};

export default function RoleBadge({
    role,
    size = "md",
    showName = true,
    showBlurb = false,
    className = "",
}) {
    const config = getRoleVisual(role);

    if (!config) {
        return null;
    }

    const { Icon, colorVar, blurb } = config;
    const dims = SIZES[size];
    const isImposter = role === "Imposter";

    return (
        <div className={`flex items-start gap-3 ${className}`}>
            <span
                className={[
                    "grid shrink-0 place-items-center rounded-md border",
                    isImposter ? "border-dashed" : "",
                    dims.box,
                ]
                    .filter(Boolean)
                    .join(" ")}
                style={{
                    color: colorVar,
                    backgroundColor: `color-mix(in srgb, ${colorVar} 12%, transparent)`,
                    borderColor: `color-mix(in srgb, ${colorVar} 28%, transparent)`,
                }}
            >
                <Icon size={dims.icon} />
            </span>

            {showName && (
                <div className="min-w-0">
                    <div
                        className={`font-semibold ${dims.text}`}
                        style={{ color: colorVar }}
                    >
                        {role}
                    </div>

                    {showBlurb && (
                        <p className="mt-0.5 text-2xs leading-relaxed text-text-secondary">
                            {blurb}
                        </p>
                    )}
                </div>
            )}
        </div>
    );
}
