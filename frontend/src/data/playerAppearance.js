/** Player color options — use full Tailwind class names for purge safety. */

export const APPEARANCE_STORAGE_KEY = "player_appearance_color";

export const DEFAULT_PLAYER_COLOR = "emerald";

export const PLAYER_COLORS = [
    {
        id: "emerald",
        label: "Emerald",
        bodyClass: "bg-emerald-400",
        glowClass: "shadow-[0_0_12px_3px_rgba(94,230,168,0.5)]",
        dotClass: "bg-emerald-200",
    },
    {
        id: "sky",
        label: "Sky",
        bodyClass: "bg-sky-400",
        glowClass: "shadow-[0_0_12px_3px_rgba(56,189,248,0.5)]",
        dotClass: "bg-sky-200",
    },
    {
        id: "amber",
        label: "Amber",
        bodyClass: "bg-amber-400",
        glowClass: "shadow-[0_0_12px_3px_rgba(251,191,36,0.5)]",
        dotClass: "bg-amber-200",
    },
    {
        id: "rose",
        label: "Rose",
        bodyClass: "bg-rose-400",
        glowClass: "shadow-[0_0_12px_3px_rgba(251,113,133,0.5)]",
        dotClass: "bg-rose-200",
    },
    {
        id: "violet",
        label: "Violet",
        bodyClass: "bg-violet-400",
        glowClass: "shadow-[0_0_12px_3px_rgba(167,139,250,0.5)]",
        dotClass: "bg-violet-200",
    },
    {
        id: "orange",
        label: "Orange",
        bodyClass: "bg-orange-400",
        glowClass: "shadow-[0_0_12px_3px_rgba(251,146,60,0.5)]",
        dotClass: "bg-orange-200",
    },
    {
        id: "cyan",
        label: "Cyan",
        bodyClass: "bg-cyan-400",
        glowClass: "shadow-[0_0_12px_3px_rgba(34,211,238,0.5)]",
        dotClass: "bg-cyan-200",
    },
    {
        id: "lime",
        label: "Lime",
        bodyClass: "bg-lime-400",
        glowClass: "shadow-[0_0_12px_3px_rgba(163,230,53,0.5)]",
        dotClass: "bg-lime-200",
    },
];

const colorById = Object.fromEntries(
    PLAYER_COLORS.map((color) => [color.id, color])
);

export function getStoredPlayerColor() {
    return (
        localStorage.getItem(APPEARANCE_STORAGE_KEY) ||
        DEFAULT_PLAYER_COLOR
    );
}

export function storePlayerColor(colorId) {
    localStorage.setItem(APPEARANCE_STORAGE_KEY, colorId);
}

export function getPlayerColor(colorId) {
    return (
        colorById[colorId] ||
        colorById[DEFAULT_PLAYER_COLOR]
    );
}
