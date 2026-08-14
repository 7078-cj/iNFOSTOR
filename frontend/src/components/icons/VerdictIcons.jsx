import IconBase, { ACCENT_OPACITY } from "./IconBase";

/*
|--------------------------------------------------------------------------
| Verdict Icons
|--------------------------------------------------------------------------
| One per entry in VALID_VOTES (game_environment.py). These carry the most
| important information on screen, so each gets its own *silhouette* as well
| as its own colour:
|
|   TRUE            shield      protection / it holds up
|   MISLEADING      triangle    caution, borrowed from warning signage
|   FALSE/HOAX      octagon     stop, borrowed from stop signage
|   OUT_OF_CONTEXT  brackets    a fragment lifted out of its frame
|   CONTINUE        circle      an open loop, nothing concluded
|
| Because the shapes differ, a colour-blind player — or anyone glancing at a
| phone in sunlight — can still tell the verdicts apart. No verdict is
| distinguished by hue alone anywhere in the UI.
*/

/* TRUE — shield, checked. */
export function VerdictTrueIcon(props) {
    return (
        <IconBase {...props}>
            <path
                d="M12 2.8 4.5 5.9v6.2c0 4.3 3.1 7.9 7.5 9.1 4.4-1.2 7.5-4.8 7.5-9.1V5.9Z"
                fill="currentColor"
                fillOpacity={ACCENT_OPACITY}
            />
            <path d="m8.6 11.8 2.5 2.5 4.5-4.9" />
        </IconBase>
    );
}

/* MISLEADING — warning triangle, split down the middle: part of it is
   true, which is exactly what makes it misleading. */
export function VerdictMisleadingIcon(props) {
    return (
        <IconBase {...props}>
            <path
                d="M12 3.4 2.9 19.2a1.2 1.2 0 0 0 1 1.8h16.2a1.2 1.2 0 0 0 1-1.8Z"
                fill="currentColor"
                fillOpacity={ACCENT_OPACITY}
            />
            <path d="M12 3.4V21" strokeDasharray="2.2 2.2" />
            <path d="M12 9.5v4" />
            <path d="M12 16.8h.01" />
        </IconBase>
    );
}

/* FALSE / HOAX — octagon, struck through. */
export function VerdictFalseIcon(props) {
    return (
        <IconBase {...props}>
            <path
                d="M8.4 2.9h7.2l5.5 5.5v7.2l-5.5 5.5H8.4L2.9 15.6V8.4Z"
                fill="currentColor"
                fillOpacity={ACCENT_OPACITY}
            />
            <path d="m9.2 9.2 5.6 5.6M14.8 9.2l-5.6 5.6" />
        </IconBase>
    );
}

/* OUT OF CONTEXT — a fragment pulled out of the frame it belonged to. */
export function VerdictContextIcon(props) {
    return (
        <IconBase {...props}>
            <path d="M8.5 3.5h-5v5M15.5 20.5h5v-5" />
            <rect
                x="3.5"
                y="11"
                width="9.5"
                height="9.5"
                rx="1.5"
                fill="currentColor"
                fillOpacity={ACCENT_OPACITY}
            />
            <rect
                x="11"
                y="3.5"
                width="9.5"
                height="9.5"
                rx="1.5"
                strokeDasharray="2.4 2.4"
            />
        </IconBase>
    );
}

/* CONTINUE INVESTIGATION — an open loop; the question stays live. */
export function VerdictContinueIcon(props) {
    return (
        <IconBase {...props}>
            <circle
                cx="12"
                cy="12"
                r="8.5"
                fill="currentColor"
                fillOpacity={ACCENT_OPACITY}
                strokeDasharray="3.4 2.6"
            />
            <path d="M12 7.5v5l3 2" />
        </IconBase>
    );
}
