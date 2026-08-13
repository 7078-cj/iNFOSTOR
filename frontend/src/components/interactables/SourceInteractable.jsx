import Interactable from "../Interactable";
import { getSpriteForObject } from "./sprites";

const PROMPTS = {
    library: "Press E — Browse shelf",
    tv: "Press E — Watch broadcast",
    computer: "Press E — Use computer",
    "archive-computer": "Press E — Archive terminal",
    radio: "Press E — Tune in",
    "second-radio": "Press E — Radio booth",
    bulletin: "Press E — Read notices",
    newsdesk: "Press E — News desk",
};

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
            promptLabel={PROMPTS[id] || "Press E — Investigate"}
            disabled={disabled}
            disabledLabel={disabledLabel}
            asset={asset}
        >
            {(isNear) => getSpriteForObject(id, isNear && !disabled)}
        </Interactable>
    );
}
