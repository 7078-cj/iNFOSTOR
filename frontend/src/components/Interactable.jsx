import { useEffect } from "react";
import { distanceBetweenCenters } from "../utils/collision";

const INTERACT_RANGE = 46;
const INTERACT_KEY = "e";

export default function Interactable({
    x,
    y,
    w = 28,
    h = 28,
    z = 0,
    player,
    onInteract,
    promptLabel = "Press E",
    asset = null,
    assetClassName = "",
}) {
    const rect = { x, y, w, h };

    const isNear = player
        ? distanceBetweenCenters(player, rect) < INTERACT_RANGE
        : false;

    useEffect(() => {
        if (!isNear) return;

        const handleKeyDown = (e) => {
            if (e.key.toLowerCase() === INTERACT_KEY) {
                onInteract?.();
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [isNear, onInteract]);

    return (
        <>
            <div
                className={`absolute transition-shadow duration-200 ${
                    isNear
                        ? "shadow-[0_0_18px_6px_rgba(120,200,255,0.55)]"
                        : "shadow-[0_0_8px_2px_rgba(120,200,255,0.25)]"
                }`}
                style={{
                    left: x,
                    top: y,
                    width: w,
                    height: h,
                    zIndex: z,
                }}
            >
                {asset ? (
                    <img
                        src={asset}
                        alt=""
                        draggable={false}
                        className={`h-full w-full object-contain ${assetClassName}`}
                    />
                ) : (
                    <div className="h-full w-full rounded-full bg-sky-400" />
                )}
            </div>

            {isNear && (
                <div
                    className="absolute whitespace-nowrap rounded-full border border-sky-400 bg-neutral-900 px-2 py-0.5 text-[11px] text-sky-100"
                    style={{
                        left: x + w / 2 - 30,
                        top: y - 26,
                        zIndex: z + 1,
                    }}
                >
                    {promptLabel}
                </div>
            )}
        </>
    );
}