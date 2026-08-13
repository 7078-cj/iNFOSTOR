import Interactable from "../Interactable";

export default function TV({
    id = "tv",
    x,
    y,
    player,
    onInteract,
    asset, // e.g. "/assets/tv.png" — omit to use the default marker
}) {
    return (
        <Interactable
            x={x}
            y={y}
            w={44}
            h={32}
            player={player}
            onInteract={() => onInteract(id)}
            promptLabel="Press E — TV"
            asset={asset}
        />
    );
}