// Player.jsx

import { useState, useEffect, useRef } from "react";
import { overlaps, resolveCollision } from "../utils/collision";
import { getFacingFromDelta } from "../utils/vision";

const SPEED = 4;

export default function Player({
    initialX = 100,
    initialY = 100,
    size = 26,
    z = 0,
    walls = [],
    bounds,
    onPositionChange,
    facing = Math.PI / 2,
    restoredPosition = null,
    appearance = null,
    asset = null,
    assetClassName = "",
}) {
    // --------------------------------------------------------------------------
    // Player Position
    // --------------------------------------------------------------------------

    const [position, setPosition] = useState({
        x: initialX,
        y: initialY,
        w: size,
        h: size,
    });

    // --------------------------------------------------------------------------
    // Keyboard State
    // --------------------------------------------------------------------------

    const keysRef = useRef({});
    const frameRef = useRef(null);
    const facingRef = useRef(Math.PI / 2);

    // --------------------------------------------------------------------------
    // Keyboard Input
    // --------------------------------------------------------------------------

    useEffect(() => {
        const handleKeyDown = (e) => {
            keysRef.current[e.key.toLowerCase()] = true;
        };

        const handleKeyUp = (e) => {
            keysRef.current[e.key.toLowerCase()] = false;
        };

        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("keyup", handleKeyUp);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("keyup", handleKeyUp);
        };
    }, []);

    // Apply server-restored position after reconnect / refresh.
    useEffect(() => {
        if (
            restoredPosition?.x == null ||
            restoredPosition?.y == null
        ) {
            return;
        }

        setPosition((prev) => ({
            ...prev,
            x: restoredPosition.x,
            y: restoredPosition.y,
        }));
    }, [restoredPosition?.x, restoredPosition?.y]);

    // --------------------------------------------------------------------------
    // Movement + Collision
    // --------------------------------------------------------------------------

    useEffect(() => {
        const tick = () => {
            setPosition((prev) => {
                const keys = keysRef.current;

                let next = { ...prev };

                let dx = 0;
                let dy = 0;

                // Movement
                if (keys["arrowup"] || keys["w"]) {
                    dy -= SPEED;
                }

                if (keys["arrowdown"] || keys["s"]) {
                    dy += SPEED;
                }

                if (keys["arrowleft"] || keys["a"]) {
                    dx -= SPEED;
                }

                if (keys["arrowright"] || keys["d"]) {
                    dx += SPEED;
                }

                // --------------------------------------------------------------
                // X-axis movement + collision
                // --------------------------------------------------------------

                next = {
                    ...next,
                    x: next.x + dx,
                };

                for (const wall of walls) {
                    if (overlaps(next, wall)) {
                        next = resolveCollision(next, wall);
                    }
                }

                // --------------------------------------------------------------
                // Y-axis movement + collision
                // --------------------------------------------------------------

                next = {
                    ...next,
                    y: next.y + dy,
                };

                for (const wall of walls) {
                    if (overlaps(next, wall)) {
                        next = resolveCollision(next, wall);
                    }
                }

                // --------------------------------------------------------------
                // World Bounds
                // --------------------------------------------------------------

                if (bounds) {
                    next.x = Math.max(
                        0,
                        Math.min(
                            bounds.width - next.w,
                            next.x
                        )
                    );

                    next.y = Math.max(
                        0,
                        Math.min(
                            bounds.height - next.h,
                            next.y
                        )
                    );
                }

                // --------------------------------------------------------------
                // Report Position Change
                // --------------------------------------------------------------

                if (dx !== 0 || dy !== 0) {
                    facingRef.current = getFacingFromDelta(
                        dx,
                        dy,
                        facingRef.current
                    );
                }

                if (
                    next.x !== prev.x ||
                    next.y !== prev.y
                ) {
                    onPositionChange?.(next, facingRef.current);
                }

                return next;
            });

            frameRef.current = requestAnimationFrame(tick);
        };

        frameRef.current = requestAnimationFrame(tick);

        return () => {
            if (frameRef.current) {
                cancelAnimationFrame(frameRef.current);
            }
        };
    }, [walls, bounds, onPositionChange]);

    // --------------------------------------------------------------------------
    // Render
    // --------------------------------------------------------------------------

    return (
        <div
            className="absolute"
            style={{
                left: position.x,
                top: position.y,
                width: position.w,
                height: position.h,
                zIndex: z,
            }}
        >
            {asset ? (
                <img
                    src={asset}
                    alt="Player"
                    draggable={false}
                    className={`h-full w-full object-contain ${assetClassName}`}
                />
            ) : (
                <>
                    <div
                        className={`h-full w-full rounded-md ${
                            appearance?.bodyClass || "bg-emerald-400"
                        } ${
                            appearance?.glowClass ||
                            "shadow-[0_0_12px_3px_rgba(94,230,168,0.5)]"
                        }`}
                    />
                    <div
                        className={`absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full ${
                            appearance?.dotClass || "bg-emerald-200"
                        }`}
                        style={{
                            transform: `translate(-50%, -50%) rotate(${facing}rad) translateY(-14px)`,
                        }}
                    />
                </>
            )}
        </div>
    );
}