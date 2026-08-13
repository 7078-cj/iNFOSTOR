import { ROOMS, DECORATIONS, WORLD_W, WORLD_H, FLOOR_TILE } from "../../data/mapEnvironment";

function FloorBase() {
    return (
        <>
            <div
                className="absolute inset-0"
                style={{
                    backgroundColor: "#0c0e14",
                    backgroundImage: `
                        linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)
                    `,
                    backgroundSize: `${FLOOR_TILE}px ${FLOOR_TILE}px`,
                }}
            />
            <div
                className="absolute inset-0 opacity-30"
                style={{
                    backgroundImage:
                        "radial-gradient(circle at 30% 25%, rgba(56,189,248,0.06) 0%, transparent 45%), radial-gradient(circle at 75% 70%, rgba(167,139,250,0.05) 0%, transparent 40%)",
                }}
            />
        </>
    );
}

function RoomZone({ room }) {
    return (
        <div
            className="absolute"
            style={{
                left: room.x,
                top: room.y,
                width: room.w,
                height: room.h,
            }}
        >
            <div
                className={`absolute inset-0 bg-gradient-to-br ${room.floor}`}
            />
            <div
                className="absolute inset-0"
                style={{ backgroundColor: room.accent }}
            />
            <div className="absolute inset-2 rounded border border-white/[0.04]" />

            <div
                className={`absolute left-3 top-3 text-[10px] font-bold uppercase tracking-[0.2em] ${room.labelColor}`}
            >
                {room.label}
            </div>
        </div>
    );
}

function Decoration({ item }) {
    switch (item.type) {
        case "rug":
            return (
                <div
                    className="absolute rounded-lg border border-white/[0.03]"
                    style={{
                        left: item.x,
                        top: item.y,
                        width: item.w,
                        height: item.h,
                        backgroundColor: item.color,
                        backgroundImage:
                            "repeating-linear-gradient(45deg, transparent, transparent 8px, rgba(255,255,255,0.02) 8px, rgba(255,255,255,0.02) 16px)",
                    }}
                />
            );

        case "ring":
            return (
                <div
                    className="absolute rounded-full border border-emerald-400/10"
                    style={{
                        left: item.x - item.size / 2,
                        top: item.y - item.size / 2,
                        width: item.size,
                        height: item.size,
                        backgroundColor: item.color,
                    }}
                />
            );

        case "bookshelf":
            return (
                <div
                    className="absolute rounded-sm border border-amber-950/60 bg-gradient-to-b from-amber-900 to-amber-950"
                    style={{
                        left: item.x,
                        top: item.y,
                        width: item.w,
                        height: item.h,
                    }}
                >
                    {[0, 1, 2, 3].map((i) => (
                        <div
                            key={i}
                            className="absolute left-1 right-1 h-1 rounded-sm bg-amber-800/80"
                            style={{ top: 12 + i * 22 }}
                        />
                    ))}
                </div>
            );

        case "desk":
            return (
                <div
                    className="absolute rounded-sm border border-neutral-600 bg-neutral-700 shadow-md"
                    style={{
                        left: item.x,
                        top: item.y,
                        width: item.w,
                        height: item.h,
                    }}
                />
            );

        case "monitor":
            return (
                <div
                    className="absolute rounded-sm border-2 border-neutral-600 bg-neutral-900"
                    style={{
                        left: item.x,
                        top: item.y,
                        width: item.w,
                        height: item.h,
                    }}
                >
                    <div className="absolute inset-0.5 rounded-sm bg-sky-950/80" />
                </div>
            );

        case "server-rack":
            return (
                <div
                    className="absolute rounded-sm border border-cyan-900/50 bg-neutral-900"
                    style={{
                        left: item.x,
                        top: item.y,
                        width: item.w,
                        height: item.h,
                    }}
                >
                    {[0, 1, 2, 3, 4].map((i) => (
                        <div
                            key={i}
                            className="absolute left-1 right-1 flex gap-0.5"
                            style={{ top: 8 + i * 16 }}
                        >
                            <div className="h-1 w-1 rounded-full bg-green-500/60" />
                            <div className="h-1 w-1 rounded-full bg-cyan-500/40" />
                        </div>
                    ))}
                </div>
            );

        case "cable":
            return (
                <div
                    className="absolute rounded-full bg-neutral-600/60"
                    style={{
                        left: item.x,
                        top: item.y,
                        width: item.w,
                        height: item.h,
                    }}
                />
            );

        case "couch":
            return (
                <div
                    className="absolute rounded-md border border-violet-900/40 bg-violet-950/60"
                    style={{
                        left: item.x,
                        top: item.y,
                        width: item.w,
                        height: item.h,
                    }}
                />
            );

        case "bench":
            return (
                <div
                    className="absolute rounded-sm border border-emerald-900/30 bg-emerald-950/40"
                    style={{
                        left: item.x,
                        top: item.y,
                        width: item.w,
                        height: item.h,
                    }}
                />
            );

        case "plant":
            return (
                <div
                    className="absolute"
                    style={{ left: item.x, top: item.y }}
                >
                    <div className="h-4 w-5 rounded-b-full bg-amber-900/80" />
                    <div className="absolute -left-1 -top-2 h-5 w-7 rounded-full bg-emerald-800/70" />
                </div>
            );

        case "lamp":
            return (
                <div
                    className="absolute"
                    style={{ left: item.x, top: item.y }}
                >
                    <div className="h-8 w-1 rounded-full bg-neutral-600" />
                    <div className="absolute -left-2 top-0 h-4 w-5 rounded-full bg-amber-200/20 shadow-[0_0_12px_4px_rgba(251,191,36,0.15)]" />
                </div>
            );

        case "sign-post":
            return (
                <div
                    className="absolute flex items-center gap-1"
                    style={{ left: item.x, top: item.y }}
                >
                    <div className="h-6 w-1 rounded-full bg-neutral-600" />
                    <span className="rounded border border-white/10 bg-black/50 px-2 py-0.5 text-[9px] uppercase tracking-wider text-slate-500">
                        {item.label}
                    </span>
                </div>
            );

        case "corridor":
            return (
                <div
                    className="absolute rounded-sm"
                    style={{
                        left: item.x,
                        top: item.y,
                        width: item.w,
                        height: item.h,
                        backgroundColor: item.color,
                        backgroundImage:
                            "repeating-linear-gradient(90deg, transparent, transparent 12px, rgba(255,255,255,0.015) 12px, rgba(255,255,255,0.015) 24px)",
                    }}
                />
            );

        case "floor-icon":
            return (
                <div
                    className="absolute flex h-8 w-8 items-center justify-center rounded-full border border-white/[0.04] bg-black/20 text-sm opacity-40"
                    style={{ left: item.x, top: item.y }}
                >
                    {item.icon}
                </div>
            );

        default:
            return null;
    }
}

/**
 * Static map visuals: floor, themed rooms, and decorative props.
 */
export default function GameEnvironment() {
    return (
        <div
            className="absolute left-0 top-0"
            style={{ width: WORLD_W, height: WORLD_H, zIndex: 0 }}
        >
            <FloorBase />

            {ROOMS.map((room) => (
                <RoomZone key={room.id} room={room} />
            ))}

            {DECORATIONS.map((item, i) => (
                <Decoration key={`${item.type}-${i}`} item={item} />
            ))}
        </div>
    );
}

export { WORLD_W, WORLD_H };
