import { distanceBetweenCenters } from "../utils/collision";

const SABOTAGE_RANGE = 50;

export default function ImposterPanel({
    phase,
    nearbyObjectId,
    sabotageCooldown,
    onFabricate,
    onSabotage,
}) {
    if (phase !== "investigation" && phase !== "discussion") {
        return null;
    }

    const canSabotage =
        nearbyObjectId && sabotageCooldown <= 0;

    return (
        <div className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2 rounded border border-red-500/30 bg-black/80 px-4 py-2 text-xs">
            <div className="mb-2 text-center font-semibold uppercase tracking-wide text-red-400">
                Imposter Abilities
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2">
                <button
                    onClick={onFabricate}
                    className="rounded bg-red-900/80 px-3 py-1.5 font-medium uppercase tracking-wide hover:bg-red-800"
                    title="Press G"
                >
                    Fabricate (G)
                </button>

                <button
                    onClick={onSabotage}
                    disabled={!canSabotage}
                    className="rounded bg-red-900/80 px-3 py-1.5 font-medium uppercase tracking-wide hover:bg-red-800 disabled:cursor-not-allowed disabled:opacity-40"
                    title="Press F near a source"
                >
                    {sabotageCooldown > 0
                        ? `Sabotage (${sabotageCooldown}s)`
                        : nearbyObjectId
                          ? `Sabotage ${nearbyObjectId} (F)`
                          : "Sabotage (F — get closer)"}
                </button>
            </div>
        </div>
    );
}

export function findNearbyInvestigationObject(
    playerRect,
    investigationObjects,
    sabotagedObjects = {}
) {
    let nearest = null;
    let nearestDist = Infinity;

    for (const obj of investigationObjects) {
        if (sabotagedObjects[obj.id]?.active) {
            continue;
        }

        const dist = distanceBetweenCenters(playerRect, obj);
        if (dist <= SABOTAGE_RANGE && dist < nearestDist) {
            nearest = obj.id;
            nearestDist = dist;
        }
    }

    return nearest;
}

export { SABOTAGE_RANGE };
