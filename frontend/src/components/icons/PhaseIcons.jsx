import IconBase, { ACCENT_OPACITY } from "./IconBase";

/*
|--------------------------------------------------------------------------
| Phase Icons
|--------------------------------------------------------------------------
| The round flow, one icon per step. Read left to right they tell the story
| of a round: a signal arrives, it gets searched, findings are pinned up,
| the group argues, the group commits, the truth is uncovered.
|
| Each pairs with a --color-phase-* token. Together the icon, the colour and
| the banner treatment give every phase an identity that survives a glance.
*/

/* Announcement — an incoming broadcast. */
export function PhaseAnnouncementIcon(props) {
    return (
        <IconBase {...props}>
            <rect
                x="6.5"
                y="9"
                width="11"
                height="11"
                rx="1.8"
                fill="currentColor"
                fillOpacity={ACCENT_OPACITY}
            />
            <path d="M9.8 13h4.4M9.8 16.2h2.8" />
            <path d="M12 9V5.6" />
            <circle cx="12" cy="4" r="1.4" />
            <path d="M8.4 4.4a5 5 0 0 0-1.5 2.2M15.6 4.4a5 5 0 0 1 1.5 2.2" />
        </IconBase>
    );
}

/* Investigation — searching the ground. */
export function PhaseInvestigationIcon(props) {
    return (
        <IconBase {...props}>
            <circle
                cx="10.5"
                cy="10.5"
                r="6.5"
                fill="currentColor"
                fillOpacity={ACCENT_OPACITY}
            />
            <path d="m15.3 15.3 5 5" />
            <path d="M7.8 10.5a2.7 2.7 0 0 1 2.7-2.7" />
        </IconBase>
    );
}

/* Evidence — findings pinned to the board. */
export function PhaseEvidenceIcon(props) {
    return (
        <IconBase {...props}>
            <rect
                x="4"
                y="6.5"
                width="9"
                height="11.5"
                rx="1.4"
                transform="rotate(-4 4 6.5)"
                fill="currentColor"
                fillOpacity={ACCENT_OPACITY}
            />
            <rect x="10.5" y="5" width="9" height="11.5" rx="1.4" />
            <path d="M13.2 8.6h3.6M13.2 11.4h2.2" />
            <circle cx="15" cy="4.4" r="1.3" />
        </IconBase>
    );
}

/* Discussion — two positions in the room. */
export function PhaseDiscussionIcon(props) {
    return (
        <IconBase {...props}>
            <path
                d="M3.5 7.4A2 2 0 0 1 5.5 5.4h7a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H8l-3.4 2.6v-2.6a1.1 1.1 0 0 1-1.1-1.1Z"
                fill="currentColor"
                fillOpacity={ACCENT_OPACITY}
            />
            <path d="M17 9.2h1.5a2 2 0 0 1 2 2v4a1.1 1.1 0 0 1-1.1 1.1v2.6L16 16.2h-3a2 2 0 0 1-2-2" />
        </IconBase>
    );
}

/* Consensus — separate positions converging on one. */
export function PhaseConsensusIcon(props) {
    return (
        <IconBase {...props}>
            <circle
                cx="12"
                cy="12"
                r="4"
                fill="currentColor"
                fillOpacity={ACCENT_OPACITY}
            />
            <path d="m10.3 12 1.2 1.2 2.3-2.5" />
            <path d="M12 3.2v3.4M12 17.4v3.4M3.2 12h3.4M17.4 12h3.4" />
        </IconBase>
    );
}

/* Reveal — the truth uncovered. */
export function PhaseRevealIcon(props) {
    return (
        <IconBase {...props}>
            <path
                d="M2.6 12S6 6.2 12 6.2 21.4 12 21.4 12 18 17.8 12 17.8 2.6 12 2.6 12Z"
                fill="currentColor"
                fillOpacity={ACCENT_OPACITY}
            />
            <circle cx="12" cy="12" r="3.1" />
            <path d="M12 3.2v1.6M4.9 5.6l1.1 1.2M19.1 5.6l-1.1 1.2" />
        </IconBase>
    );
}
