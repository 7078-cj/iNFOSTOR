import IconBase, { ACCENT_OPACITY } from "./IconBase";

/*
|--------------------------------------------------------------------------
| Role Icons
|--------------------------------------------------------------------------
| One per role from the design doc. Each is built as "an instrument applied
| to a subject" so the family reads consistently: the investigator roles all
| show a tool doing work on evidence, while the Imposter alone breaks the
| pattern — no instrument, just a mask. That break is intentional; it is the
| only icon in the set that is hiding something rather than examining it.
*/

/* Detective — a lens over a record of dates and names, the inconsistency
   picked out as a single filled mark. */
export function DetectiveIcon(props) {
    return (
        <IconBase {...props}>
            <rect x="3" y="4" width="12" height="14" rx="1.5" />
            <path d="M6 8h6M6 11h4" />
            <circle
                cx="15.5"
                cy="14.5"
                r="4.5"
                fill="currentColor"
                fillOpacity={ACCENT_OPACITY}
            />
            <path d="M18.8 17.8 21.5 20.5" />
        </IconBase>
    );
}

/* Researcher — an open reference volume, one page verified. */
export function ResearcherIcon(props) {
    return (
        <IconBase {...props}>
            <path d="M12 6.5C10.5 5 8.2 4.5 5 4.5v13c3.2 0 5.5.5 7 2 1.5-1.5 3.8-2 7-2v-13c-3.2 0-5.5.5-7 2Z" />
            <path d="M12 6.5v13" />
            <path
                d="M5 4.5c3.2 0 5.5.5 7 2v13c-1.5-1.5-3.8-2-7-2Z"
                fill="currentColor"
                fillOpacity={ACCENT_OPACITY}
                stroke="none"
            />
            <path d="m14.8 12.4 1.5 1.5 3-3.2" />
        </IconBase>
    );
}

/* Source Investigator — a claim traced back up its chain to the origin
   node, which is the filled one. */
export function SourceInvestigatorIcon(props) {
    return (
        <IconBase {...props}>
            <circle
                cx="5.5"
                cy="18.5"
                r="2.5"
                fill="currentColor"
                fillOpacity={ACCENT_OPACITY}
            />
            <circle cx="12" cy="12" r="2.5" />
            <circle cx="18.5" cy="5.5" r="2.5" />
            <path d="m7.3 16.7 2.9-2.9M13.8 10.2l2.9-2.9" />
            <path d="M18.5 12.5v2a4 4 0 0 1-4 4h-2" />
        </IconBase>
    );
}

/* Image Investigator — a photograph under crop brackets, the frame itself
   under scrutiny rather than its contents. */
export function ImageInvestigatorIcon(props) {
    return (
        <IconBase {...props}>
            <path d="M3 7.5V4.5h3M21 7.5V4.5h-3M3 16.5v3h3M21 16.5v3h-3" />
            <rect
                x="6.5"
                y="7.5"
                width="11"
                height="9"
                rx="1.5"
                fill="currentColor"
                fillOpacity={ACCENT_OPACITY}
            />
            <circle cx="9.8" cy="10.6" r="1" />
            <path d="m6.5 15 3.2-3 2.4 2.2 2.6-2.6 2.8 2.9" />
        </IconBase>
    );
}

/* Data Analyst — a series with one bar out of trend, and the trend line
   that exposes it. */
export function DataAnalystIcon(props) {
    return (
        <IconBase {...props}>
            <path d="M3.5 20h17" />
            <rect x="5" y="13" width="3.2" height="7" rx="0.8" />
            <rect
                x="10.4"
                y="8.5"
                width="3.2"
                height="11.5"
                rx="0.8"
                fill="currentColor"
                fillOpacity={ACCENT_OPACITY}
            />
            <rect x="15.8" y="15" width="3.2" height="5" rx="0.8" />
            <path d="m5 9.5 4.5-4 3.5 3 6-6.5" />
        </IconBase>
    );
}

/* Media Literacy Analyst — amplified language. The megaphone is the
   technique; the waves are the emotional pressure it applies. */
export function MediaLiteracyIcon(props) {
    return (
        <IconBase {...props}>
            <path
                d="M3.5 10.5v3a1.5 1.5 0 0 0 1.5 1.5h2l6 4V5l-6 4H5a1.5 1.5 0 0 0-1.5 1.5Z"
                fill="currentColor"
                fillOpacity={ACCENT_OPACITY}
            />
            <path d="M7 15v4.5" />
            <path d="M16.8 9.2a4 4 0 0 1 0 5.6" />
            <path d="M19.4 6.6a7.5 7.5 0 0 1 0 10.8" />
        </IconBase>
    );
}

/* Imposter — the one role that conceals. A face split between what is
   shown and what is behind it. */
export function ImposterIcon(props) {
    return (
        <IconBase {...props}>
            <path d="M12 3.2c-3.6 0-6.5 1.4-6.5 3.4 0 5.4 2.6 12.6 6.5 14.2 3.9-1.6 6.5-8.8 6.5-14.2 0-2-2.9-3.4-6.5-3.4Z" />
            <path
                d="M12 3.2c-3.6 0-6.5 1.4-6.5 3.4 0 5.4 2.6 12.6 6.5 14.2Z"
                fill="currentColor"
                fillOpacity={ACCENT_OPACITY}
                stroke="none"
            />
            <path d="M12 3.2v17.6" />
            <path d="M8.2 9.4c.9-.7 1.9-.7 2.8 0" />
            <path d="M13 9.4c.9-.7 1.9-.7 2.8 0" />
        </IconBase>
    );
}
