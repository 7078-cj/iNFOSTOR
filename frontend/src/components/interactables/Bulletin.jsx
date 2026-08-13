import Interactable from "../Interactable";

export default function Bulletin({
    id = "bulletin",
    x,
    y,
    player,
    onInteract,
    disabled = false,
    disabledLabel,
    asset, // e.g. "/assets/bulletin.png" — omit to use the default marker
}) {
    return (
        <Interactable
            x={x}
            y={y}
            w={40}
            h={34}
            player={player}
            onInteract={() => onInteract(id)}
            promptLabel="Press E — Noticeboard"
            disabled={disabled}
            disabledLabel={disabledLabel}
            asset={asset}
        />
    );
}