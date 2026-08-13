import Interactable from "../Interactable";

export default function Computer({
    id = "computer",
    x,
    y,
    player,
    onInteract,
    disabled = false,
    disabledLabel,
    asset, // e.g. "/assets/computer.png" — omit to use the default marker
}) {
    return (
        <Interactable
            x={x}
            y={y}
            w={38}
            h={32}
            player={player}
            onInteract={() => onInteract(id)}
            promptLabel="Press E — Computer"
            disabled={disabled}
            disabledLabel={disabledLabel}
            asset={asset}
        />
    );
}