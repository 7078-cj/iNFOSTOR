import Interactable from "../Interactable";

export default function Library({
    id = "library",
    x,
    y,
    player,
    onInteract,
    disabled = false,
    disabledLabel,
    asset, // e.g. "/assets/library.png" — omit to use the default marker
}) {
    return (
        <Interactable
            x={x}
            y={y}
            w={40}
            h={40}
            player={player}
            onInteract={() => onInteract(id)}
            promptLabel="Press E — Library"
            disabled={disabled}
            disabledLabel={disabledLabel}
            asset={asset}
        />
    );
}