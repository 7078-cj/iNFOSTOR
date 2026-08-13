// Player.jsx

import { useState, useEffect, useRef } from "react";
import { overlaps, resolveCollision } from "../utils/collision";

const SPEED = 4;

export default function Player({
    initialX = 100,
    initialY = 100,
    size = 26,
    z = 0,
    walls = [],
    bounds,
    onPositionChange,
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

                if (
                    next.x !== prev.x ||
                    next.y !== prev.y
                ) {
                    onPositionChange?.(next);
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
                <div className="h-full w-full rounded-md bg-emerald-400 shadow-[0_0_12px_3px_rgba(94,230,168,0.5)]" />
            )}
        </div>
    );
}