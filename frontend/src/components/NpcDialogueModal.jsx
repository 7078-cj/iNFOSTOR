import { useMemo } from "react";
import { NPCS } from "../data/npcs";
import { getNpcDialogue } from "../data/npcDialogue";

export default function NpcDialogueModal({
    npcId,
    announcement,
    playerRole,
    onClose,
    onSubmitEvidence,
}) {
    const npc = useMemo(
        () => NPCS.find((n) => n.id === npcId),
        [npcId]
    );

    const dialogue = useMemo(() => {
        if (!npcId || !announcement?.id) return null;
        return getNpcDialogue(announcement.id, npcId);
    }, [npcId, announcement?.id]);

    if (!npc) return null;

    const fallbackDialogue = {
        greeting: "Sorry, I haven't heard much about that yet.",
        lines: [
            "Maybe check the news desk or library for more information.",
        ],
        testimony: `${npc.name} (${npc.title}): No specific information about the current announcement.`,
        bestFor: [],
    };

    const activeDialogue = dialogue || fallbackDialogue;

    const handleLogTestimony = () => {
        onSubmitEvidence({
            source: npcId,
            note: activeDialogue.testimony,
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
            <div className="w-full max-w-md overflow-hidden rounded-xl border border-neutral-600 bg-neutral-900 shadow-2xl">
                {/* Header */}
                <div
                    className="flex items-center gap-3 border-b border-neutral-700 px-4 py-3"
                    style={{ backgroundColor: `${npc.color}22` }}
                >
                    <div
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-lg font-bold"
                        style={{
                            backgroundColor: npc.color,
                            color: npc.accent,
                        }}
                    >
                        {npc.name[0]}
                    </div>
                    <div className="min-w-0 flex-1">
                        <h2 className="truncate text-base font-semibold text-white">
                            {npc.name}
                        </h2>
                        <p className="truncate text-xs text-neutral-400">
                            {npc.title}
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-lg px-2 py-1 text-neutral-400 hover:bg-neutral-800 hover:text-white"
                        aria-label="Close"
                    >
                        ✕
                    </button>
                </div>

                {/* Announcement context */}
                {announcement && (
                    <div className="border-b border-neutral-800 bg-neutral-950/50 px-4 py-2">
                        <p className="text-[10px] uppercase tracking-wide text-neutral-500">
                            About the current announcement
                        </p>
                        <p className="mt-0.5 line-clamp-2 text-xs text-neutral-300">
                            {announcement.headline || announcement.text}
                        </p>
                    </div>
                )}

                {/* Dialogue */}
                <div className="space-y-3 px-4 py-4">
                    <div className="rounded-lg bg-neutral-800/60 px-3 py-2">
                        <p className="text-sm italic text-neutral-300">
                            &ldquo;{activeDialogue.greeting}&rdquo;
                        </p>
                    </div>

                    {activeDialogue.lines.map((line, i) => (
                        <div
                            key={i}
                            className="flex gap-2"
                        >
                            <div
                                className="mt-1 h-2 w-2 shrink-0 rounded-full"
                                style={{ backgroundColor: npc.color }}
                            />
                            <p className="text-sm leading-relaxed text-neutral-200">
                                {line}
                            </p>
                        </div>
                    ))}

                    {activeDialogue.bestFor?.length > 0 && (
                        <p
                            className={`text-[11px] ${
                                playerRole &&
                                activeDialogue.bestFor.includes(playerRole)
                                    ? "text-emerald-400"
                                    : "text-neutral-500"
                            }`}
                        >
                            {playerRole &&
                            activeDialogue.bestFor.includes(playerRole)
                                ? `Relevant to your role (${playerRole})`
                                : `Useful for: ${activeDialogue.bestFor.join(", ")}`}
                        </p>
                    )}
                </div>

                {/* Actions */}
                <div className="flex gap-2 border-t border-neutral-700 px-4 py-3">
                    <button
                        type="button"
                        onClick={handleLogTestimony}
                        className="flex-1 rounded-lg bg-emerald-700 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-600"
                    >
                        Log testimony as evidence
                    </button>
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-lg border border-neutral-600 px-4 py-2 text-sm text-neutral-300 hover:bg-neutral-800"
                    >
                        Leave
                    </button>
                </div>
            </div>
        </div>
    );
}
