import { ROOMS, WORLD_W, WORLD_H } from "../data/mapEnvironment";

const MAP_W = 184;
const MAP_H = 124;
const PAD = 6;

function toMap(x, y) {
    const scaleX = (MAP_W - PAD * 2) / WORLD_W;
    const scaleY = (MAP_H - PAD * 2) / WORLD_H;
    return {
        x: PAD + x * scaleX,
        y: PAD + y * scaleY,
    };
}

/**
 * Compact overview of the world, player position, and nearby players.
 */
export default function Minimap({
    playerRect,
    otherPlayers = [],
    userId,
    viewportWidth,
    viewportHeight,
    walls = [],
}) {
    const playerCenter = {
        x: playerRect.x + playerRect.w / 2,
        y: playerRect.y + playerRect.h / 2,
    };

    const playerDot = toMap(playerCenter.x, playerCenter.y);

    const halfViewW = viewportWidth / 2;
    const halfViewH = viewportHeight / 2;

    const viewRect = {
        x: Math.max(0, playerCenter.x - halfViewW),
        y: Math.max(0, playerCenter.y - halfViewH),
        w: Math.min(viewportWidth, WORLD_W),
        h: Math.min(viewportHeight, WORLD_H),
    };

    const tl = toMap(viewRect.x, viewRect.y);
    const br = toMap(
        viewRect.x + viewRect.w,
        viewRect.y + viewRect.h
    );

    const scaleX = (MAP_W - PAD * 2) / WORLD_W;
    const scaleY = (MAP_H - PAD * 2) / WORLD_H;

    return (
        <div className="absolute right-4 top-20 z-10 overflow-hidden rounded-lg border border-white/10 bg-black/80 shadow-lg backdrop-blur-sm">
            <div className="border-b border-white/10 px-2 py-1 text-[9px] font-bold uppercase tracking-wider text-slate-400">
                Map
            </div>

            <svg
                width={MAP_W}
                height={MAP_H}
                className="block"
                aria-label="Minimap"
            >
                <rect
                    x={0}
                    y={0}
                    width={MAP_W}
                    height={MAP_H}
                    fill="#0a0c10"
                />

                {ROOMS.map((room) => {
                    const pos = toMap(room.x, room.y);
                    return (
                        <rect
                            key={room.id}
                            x={pos.x}
                            y={pos.y}
                            width={room.w * scaleX}
                            height={room.h * scaleY}
                            fill="rgba(255,255,255,0.04)"
                            stroke="rgba(255,255,255,0.06)"
                            strokeWidth={0.5}
                        />
                    );
                })}

                {walls.slice(4).map((wall) => {
                    const pos = toMap(wall.x, wall.y);
                    return (
                        <rect
                            key={wall.id}
                            x={pos.x}
                            y={pos.y}
                            width={Math.max(1, wall.w * scaleX)}
                            height={Math.max(1, wall.h * scaleY)}
                            fill="rgba(100,116,139,0.5)"
                        />
                    );
                })}

                <rect
                    x={tl.x}
                    y={tl.y}
                    width={Math.max(2, br.x - tl.x)}
                    height={Math.max(2, br.y - tl.y)}
                    fill="none"
                    stroke="rgba(148,163,184,0.35)"
                    strokeWidth={1}
                    strokeDasharray="3 2"
                />

                {otherPlayers
                    .filter(
                        (p) =>
                            String(p.user_id) !== String(userId)
                    )
                    .map((p) => {
                        const dot = toMap(
                            p.location.x + 13,
                            p.location.y + 13
                        );
                        return (
                            <circle
                                key={p.id}
                                cx={dot.x}
                                cy={dot.y}
                                r={2.5}
                                fill="#fbbf24"
                            />
                        );
                    })}

                <circle
                    cx={playerDot.x}
                    cy={playerDot.y}
                    r={3.5}
                    fill="#34d399"
                    stroke="#064e3b"
                    strokeWidth={1}
                />
            </svg>
        </div>
    );
}

export { MAP_W, MAP_H };
