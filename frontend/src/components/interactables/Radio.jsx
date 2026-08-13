import Interactable from "../Interactable";

export default function Radio({
    id = "radio",
    x,
    y,
    player,
    onInteract,
    asset, // e.g. "/assets/radio.png" — omit to use the default marker
}) {
    return (
        <Interactable
            x={x}
            y={y}
            w={34}
            h={30}
            player={player}
            onInteract={() => onInteract(id)}
            promptLabel="Press E — Radio"
            asset={asset}
        />
    );
}