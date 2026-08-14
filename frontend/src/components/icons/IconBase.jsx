/*
|--------------------------------------------------------------------------
| IconBase
|--------------------------------------------------------------------------
| Shared chassis for every custom icon in the game. Centralising the
| viewBox, stroke weight and cap/join treatment here is what makes the set
| read as one family rather than a pile of unrelated drawings.
|
| Visual DNA, applied without exception:
|   - 24x24 viewBox, geometry drawn on a 2px grid
|   - 1.5 stroke weight, scaling proportionally at other sizes
|   - round caps and joins, no mitred corners
|   - stroke: currentColor, so an icon inherits its semantic colour from
|     whatever token the parent sets (verdict, role, phase)
|   - a single low-opacity accent fill per icon carries identity; nothing
|     uses more than one filled region
|
| Icons are decorative by default and hidden from assistive tech. Passing a
| `title` promotes the icon to a labelled image instead.
*/

export default function IconBase({
    size = 24,
    strokeWidth = 1.5,
    title,
    className = "",
    children,
    ...rest
}) {
    // Keep the optical weight constant as the icon scales — a 1.5 stroke at
    // 48px reads noticeably lighter than the same stroke at 16px.
    const scaledStroke = strokeWidth * (24 / size) ** 0.35;

    return (
        <svg
            viewBox="0 0 24 24"
            width={size}
            height={size}
            fill="none"
            stroke="currentColor"
            strokeWidth={scaledStroke}
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
            role={title ? "img" : undefined}
            aria-hidden={title ? undefined : "true"}
            focusable="false"
            {...rest}
        >
            {title ? <title>{title}</title> : null}
            {children}
        </svg>
    );
}

/*
| Accent fill used across the set. Kept as a constant so every icon dips
| into the same opacity rather than each one guessing.
*/

export const ACCENT_FILL = "currentColor";
export const ACCENT_OPACITY = 0.16;
