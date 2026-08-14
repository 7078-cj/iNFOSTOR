import IconBase, { ACCENT_OPACITY } from "./IconBase";

/*
|--------------------------------------------------------------------------
| Evidence Type Icons
|--------------------------------------------------------------------------
| The five kinds of material a player can bring back from the map. These
| appear at small sizes in the evidence log, so each one is built around a
| single unmistakable silhouette rather than fine detail.
*/

/* Document / source — a record with a folded corner. */
export function EvidenceDocumentIcon(props) {
    return (
        <IconBase {...props}>
            <path
                d="M5.5 3.5h7.5l5.5 5.5v11.5a1 1 0 0 1-1 1h-12a1 1 0 0 1-1-1v-16a1 1 0 0 1 1-1Z"
                fill="currentColor"
                fillOpacity={ACCENT_OPACITY}
            />
            <path d="M13 3.5V9h5.5" />
            <path d="M8.2 13h7.6M8.2 16.4h5" />
        </IconBase>
    );
}

/* Image — a photograph. */
export function EvidenceImageIcon(props) {
    return (
        <IconBase {...props}>
            <rect
                x="3"
                y="5"
                width="18"
                height="14"
                rx="1.8"
                fill="currentColor"
                fillOpacity={ACCENT_OPACITY}
            />
            <circle cx="8.2" cy="9.6" r="1.4" />
            <path d="m3 16 4.6-4.3 3.4 3.1 3.8-3.7L21 16.6" />
        </IconBase>
    );
}

/* Statistic / graph — a plotted series. */
export function EvidenceStatIcon(props) {
    return (
        <IconBase {...props}>
            <rect
                x="3"
                y="3.5"
                width="18"
                height="17"
                rx="1.8"
                fill="currentColor"
                fillOpacity={ACCENT_OPACITY}
            />
            <path d="M7 16.5V11M12 16.5V7.6M17 16.5v-3.4" />
        </IconBase>
    );
}

/* Quote — attributed words. */
export function EvidenceQuoteIcon(props) {
    return (
        <IconBase {...props}>
            <path
                d="M4 4.5h16a1.5 1.5 0 0 1 1.5 1.5v9a1.5 1.5 0 0 1-1.5 1.5H9.5L5 20.5V16.5H4A1.5 1.5 0 0 1 2.5 15V6A1.5 1.5 0 0 1 4 4.5Z"
                fill="currentColor"
                fillOpacity={ACCENT_OPACITY}
            />
            <path d="M8.4 12.4c-1.2 0-1.9-.8-1.9-1.9s.8-1.9 1.9-1.9 1.9.8 1.9 1.9c0 1.9-1 3-2.6 3.6" />
            <path d="M15.2 12.4c-1.2 0-1.9-.8-1.9-1.9s.8-1.9 1.9-1.9 1.9.8 1.9 1.9c0 1.9-1 3-2.6 3.6" />
        </IconBase>
    );
}

/* Link — a chain, one half dashed because a link is only as good as where
   it actually resolves. */
export function EvidenceLinkIcon(props) {
    return (
        <IconBase {...props}>
            <path
                d="M10.2 13.8a3.8 3.8 0 0 0 5.6.3l2.6-2.6a3.8 3.8 0 0 0-5.4-5.4l-1.5 1.5"
                fill="currentColor"
                fillOpacity={ACCENT_OPACITY}
            />
            <path d="M13.8 10.2a3.8 3.8 0 0 0-5.6-.3l-2.6 2.6a3.8 3.8 0 0 0 5.4 5.4l1.5-1.5" />
        </IconBase>
    );
}
