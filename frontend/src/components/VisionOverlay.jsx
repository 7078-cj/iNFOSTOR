import { useEffect, useRef } from "react";
import { getHalfAngleRad } from "../utils/vision";

const FOG_RGBA = [2, 4, 10, 0.94];
const NEAR_FADE = 55;
const RANGE_FADE = 100;
const ANGLE_FADE = 0.22;

function smoothstep(edge0, edge1, x) {
    if (edge0 === edge1) {
        return x < edge0 ? 0 : 1;
    }
    const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
    return t * t * (3 - 2 * t);
}

function normalizeAngleDiff(angle) {
    let a = angle;
    while (a > Math.PI) a -= 2 * Math.PI;
    while (a < -Math.PI) a += 2 * Math.PI;
    return Math.abs(a);
}

/**
 * 0 = fully clear, 1 = fully fogged.
 */
function fogStrengthAt(px, py, cx, cy, facing, config) {
    const dx = px - cx;
    const dy = py - cy;
    const dist = Math.hypot(dx, dy);

    const nearR = config.nearRadius ?? 0;
    let nearClear = 0;

    if (nearR > 0) {
        nearClear =
            1 -
            smoothstep(
                nearR - NEAR_FADE * 0.35,
                nearR + NEAR_FADE,
                dist
            );
    }

    const halfAngle = getHalfAngleRad(config);
    const range = config.range;
    const angleDiff = normalizeAngleDiff(
        Math.atan2(dy, dx) - facing
    );

    const distClear =
        1 -
        smoothstep(
            range - RANGE_FADE,
            range + RANGE_FADE * 0.45,
            dist
        );

    const angleClear =
        1 -
        smoothstep(
            halfAngle - ANGLE_FADE * 0.25,
            halfAngle + ANGLE_FADE,
            angleDiff
        );

    const coneClear = distClear * angleClear;
    const clear = Math.max(nearClear, coneClear);

    return 1 - clear;
}

/**
 * Soft gradient fog: clear near the player and along the forward cone,
 * fading smoothly into darkness — no hard borders.
 */
export default function VisionOverlay({
    width,
    height,
    facing,
    visionConfig,
}) {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || !width || !height) {
            return;
        }

        const scale = 0.35;
        const w = Math.ceil(width * scale);
        const h = Math.ceil(height * scale);

        canvas.width = w;
        canvas.height = h;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
            return;
        }

        const imageData = ctx.createImageData(w, h);
        const data = imageData.data;

        const centerX = width / 2;
        const centerY = height / 2;

        for (let y = 0; y < h; y += 1) {
            for (let x = 0; x < w; x += 1) {
                const worldX = x / scale;
                const worldY = y / scale;
                const strength = fogStrengthAt(
                    worldX,
                    worldY,
                    centerX,
                    centerY,
                    facing,
                    visionConfig
                );

                const alpha = Math.round(strength * FOG_RGBA[3] * 255);
                const i = (y * w + x) * 4;

                data[i] = FOG_RGBA[0];
                data[i + 1] = FOG_RGBA[1];
                data[i + 2] = FOG_RGBA[2];
                data[i + 3] = alpha;
            }
        }

        ctx.putImageData(imageData, 0, 0);
    }, [width, height, facing, visionConfig]);

    if (!width || !height) {
        return null;
    }

    return (
        <canvas
            ref={canvasRef}
            className="pointer-events-none absolute inset-0 z-[5] h-full w-full blur-[2px]"
            aria-hidden
        />
    );
}
