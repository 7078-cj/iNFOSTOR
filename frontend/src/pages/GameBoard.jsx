// GameBoard.jsx
// The world is bigger than the screen. A "camera" offset is computed
// from the player's position each frame and applied as a CSS transform
// to a wrapper div containing everything (walls, other players,
// interactable, player). Moving that wrapper opposite to the player's
// movement makes the player appear locked in the center of the screen
// while the world scrolls underneath.

import { useState, useCallback, useMemo } from "react";
import Player from "../components/Player";
import Wall from "../components/Wall";
import Interactable from "../components/Interactable";
import OtherPlayer from "../components/OtherPlayer";
import useWindowSize from "../hooks/useWindowSize";

const WALL_THICKNESS = 20;

// World is larger than any viewport so there's room to walk around.
const WORLD_W = 2400;
const WORLD_H = 1600;

export default function GameBoard() {
    const { width, height } = useWindowSize(); // viewport size, captured once

    const [playerRect, setPlayerRect] = useState({
        x: WORLD_W / 2,
        y: WORLD_H / 2,
        w: 26,
        h: 26,
    });
    const [message, setMessage] = useState(null);

    const walls = useMemo(
        () => [
        { id: "wall-top", x: 0, y: 0, w: WORLD_W, h: WALL_THICKNESS },
        { id: "wall-bottom", x: 0, y: WORLD_H - WALL_THICKNESS, w: WORLD_W, h: WALL_THICKNESS },
        { id: "wall-left", x: 0, y: 0, w: WALL_THICKNESS, h: WORLD_H },
        { id: "wall-right", x: WORLD_W - WALL_THICKNESS, y: 0, w: WALL_THICKNESS, h: WORLD_H },
        { id: "wall-mid", x: WORLD_W / 2 - 60, y: WORLD_H / 2 - 200, w: 120, h: 140 },
        { id: "wall-north", x: WORLD_W / 2 - 300, y: WORLD_H / 2 - 400, w: 200, h: 30 },
        { id: "wall-south", x: WORLD_W / 2 + 100, y: WORLD_H / 2 + 250, w: 200, h: 30 },
        ],
        []
    );

    const interactable = useMemo(
        () => ({ id: "orb", x: WORLD_W / 2 + 300, y: WORLD_H / 2 + 100, w: 28, h: 28 }),
        []
    );

    const otherPlayers = useMemo(
        () => [
        { id: "p2", x: WORLD_W / 2 - 400, y: WORLD_H / 2 - 150, name: "Player 2", color: "bg-amber-400" },
        { id: "p3", x: WORLD_W / 2 + 350, y: WORLD_H / 2 - 300, name: "Player 3", color: "bg-fuchsia-400" },
        { id: "p4", x: WORLD_W / 2 - 100, y: WORLD_H / 2 + 350, name: "Player 4", color: "bg-cyan-400" },
        ],
        []
    );

    // Other players double as collidable obstacles for the main player.
    const collidables = useMemo(
        () => [...walls, ...otherPlayers.map((p) => ({ ...p, w: 26, h: 26 })), interactable],
        [walls, otherPlayers, interactable]
    );

    const handlePositionChange = useCallback((next) => {
        setPlayerRect(next);
    }, []);

    const handleInteract = useCallback(() => {
        setMessage((m) => (m ? null : "The orb hums quietly. You feel slightly braver."));
    }, []);

    // Camera offset: shift the world in the opposite direction of the
    // player so the player's center lands on the viewport's center.
    const cameraX = width / 2 - (playerRect.x + playerRect.w / 2);
    const cameraY = height / 2 - (playerRect.y + playerRect.h / 2);

    return (
        <div className="fixed inset-0 flex flex-col items-center justify-center gap-3 bg-neutral-950 font-mono">
        <div className="absolute top-4 z-10 text-xs uppercase tracking-wide text-slate-400">
            WASD / Arrows to move · E to interact
        </div>

        <div className="relative h-full w-full overflow-hidden bg-[radial-gradient(circle_at_30%_20%,_#1b1f2a,_#0a0c10)]">
            <div
            className="absolute left-0 top-0"
            style={{
                width: WORLD_W,
                height: WORLD_H,
                transform: `translate3d(${cameraX}px, ${cameraY}px, 0)`,
            }}
            >
            {walls.map((wall) => (
                <Wall key={wall.id} x={wall.x} y={wall.y} w={wall.w} h={wall.h} />
            ))}

            {otherPlayers.map((p) => (
                <OtherPlayer key={p.id} x={p.x} y={p.y} name={p.name} color={p.color} />
            ))}

            <Interactable
                x={interactable.x}
                y={interactable.y}
                w={interactable.w}
                h={interactable.h}
                player={playerRect}
                onInteract={handleInteract}
            />

            <Player
                initialX={WORLD_W / 2}
                initialY={WORLD_H / 2}
                size={26}
                walls={collidables}
                bounds={{ width: WORLD_W, height: WORLD_H }}
                onPositionChange={handlePositionChange}
            />
            </div>
        </div>

        {message && (
            <div className="absolute bottom-6 z-10 max-w-md text-center text-sm text-slate-300">
            {message}
            </div>
        )}
        </div>
    );
}