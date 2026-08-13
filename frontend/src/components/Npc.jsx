import Interactable from "./Interactable";

const NPC_W = 26;
const NPC_H = 30;

export default function Npc({ npc, player, onTalk, z = 12 }) {
    return (
        <Interactable
            x={npc.x}
            y={npc.y}
            w={NPC_W}
            h={NPC_H}
            z={z}
            player={player}
            onInteract={() => onTalk(npc.id)}
            promptLabel="Press E to talk"
        >
            {(isNear) => (
                <div className="relative h-full w-full">
                    {/* Shadow */}
                    <div
                        className="absolute bottom-0 left-1/2 h-2 w-5 -translate-x-1/2 rounded-full bg-black/30"
                        style={{ zIndex: 0 }}
                    />
                    {/* Body */}
                    <div
                        className={`absolute inset-x-1 bottom-1 top-3 rounded-md transition-all duration-200 ${
                            isNear ? "scale-105" : ""
                        }`}
                        style={{
                            backgroundColor: npc.color,
                            border: `2px solid ${npc.accent}`,
                        }}
                    />
                    {/* Head */}
                    <div
                        className="absolute left-1/2 top-0 h-4 w-4 -translate-x-1/2 rounded-full"
                        style={{
                            backgroundColor: "#fcd9b6",
                            border: `1.5px solid ${npc.accent}`,
                        }}
                    />
                    {/* Name tag when near */}
                    {isNear && (
                        <div
                            className="absolute -top-5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-neutral-900/90 px-1.5 py-0.5 text-[9px] font-medium text-white"
                            style={{ zIndex: 2 }}
                        >
                            {npc.name}
                        </div>
                    )}
                </div>
            )}
        </Interactable>
    );
}
