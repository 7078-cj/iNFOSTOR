import { buildConePolygon } from "../utils/vision";

/**
 * Screen-space fog-of-war overlay. Darkens everything OUTSIDE the vision
 * cone so the lit area in front of the player stays clear.
 */
export default function VisionOverlay({
    width,
    height,
    facing,
    visionConfig,
}) {
    if (!width || !height) {
        return null;
    }

    const cx = width / 2;
    const cy = height / 2;
    const conePoints = buildConePolygon(cx, cy, facing, visionConfig);

    return (
        <svg
            className="pointer-events-none absolute inset-0 z-[5]"
            width={width}
            height={height}
            aria-hidden
        >
            <defs>
                {/* White = show fog, black = lit (transparent) area */}
                <mask id="vision-cutout-mask">
                    <rect width="100%" height="100%" fill="white" />
                    <polygon points={conePoints} fill="black" />
                </mask>
            </defs>

            <rect
                width="100%"
                height="100%"
                fill="rgba(2, 4, 10, 0.93)"
                mask="url(#vision-cutout-mask)"
            />

            <polygon
                points={conePoints}
                fill="none"
                stroke="rgba(94, 230, 168, 0.15)"
                strokeWidth="2"
            />
        </svg>
    );
}
