import { getVerdict } from "../icons/registry";

/*
|--------------------------------------------------------------------------
| VerdictBadge
|--------------------------------------------------------------------------
| The single place a classification is rendered. Every verdict shown to a
| player — on the ballot, in the round result, on the reveal screen — comes
| through here, so a verdict can never appear in two different treatments on
| two different screens.
|
| Colour is always paired with the verdict's own silhouette, so the badge
| stays readable without hue.
*/

const SIZES = {
    sm: { pad: "px-2 py-1 gap-1.5", text: "text-2xs", icon: 13 },
    md: { pad: "px-2.5 py-1.5 gap-2", text: "text-xs", icon: 16 },
    lg: { pad: "px-4 py-2.5 gap-2.5", text: "text-base", icon: 22 },
};

export default function VerdictBadge({
    verdict,
    size = "md",
    showLabel = true,
    short = false,
    className = "",
}) {
    const config = getVerdict(verdict);

    if (!config) {
        return null;
    }

    const { Icon, label, shortLabel, colorVar, dimVar } = config;
    const dims = SIZES[size];

    return (
        <span
            className={[
                "inline-flex items-center rounded-md border font-semibold uppercase tracking-wide",
                dims.pad,
                dims.text,
                className,
            ].join(" ")}
            style={{
                color: colorVar,
                backgroundColor: dimVar,
                borderColor: `color-mix(in srgb, ${colorVar} 32%, transparent)`,
            }}
        >
            <Icon size={dims.icon} />
            {showLabel && (short ? shortLabel : label)}
        </span>
    );
}
