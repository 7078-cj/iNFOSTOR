import Interactable from "../Interactable";
import { getSpriteForObject } from "./sprites";
import { OBJECT_LABELS } from "../../data/mapInteractables";

export default function SourceInteractable({
    id,
    x,
    y,
    w,
    h,
    player,
    onInteract,
    disabled = false,
    disabledLabel = "Sabotaged",
    asset = null,
}) {
    return (
        <Interactable
            x={x}
            y={y}
            w={w}
            h={h}
            player={player}
            onInteract={() => onInteract(id)}
            promptLabel={`Press E — ${OBJECT_LABELS[id] || "Investigate"}`}
            disabled={disabled}
            disabledLabel={disabledLabel}
            asset={asset}
        >
            {(isNear) => getSpriteForObject(id, isNear && !disabled)}
        </Interactable>
    );
}
