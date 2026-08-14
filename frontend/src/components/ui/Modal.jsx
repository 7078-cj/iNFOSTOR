import { useEffect, useRef } from "react";
import { X } from "lucide-react";

/*
|--------------------------------------------------------------------------
| Modal
|--------------------------------------------------------------------------
| One dialog shell for the whole game. Handles the things that were being
| re-implemented (or skipped) per modal: escape-to-close, focus moving into
| the dialog on open and back to the trigger on close, a scroll lock, and a
| backdrop click target that doesn't fire when the drag started inside.
|
| `dismissable` is deliberately opt-out. The consensus vote uses it: that
| dialog must not be escapable, because dismissing it would leave the player
| looking at a board with no way back to the ballot.
*/

export default function Modal({
    open,
    onClose,
    title,
    subtitle,
    accent = null,
    icon: Icon = null,
    size = "md",
    dismissable = true,
    footer = null,
    children,
}) {
    const panelRef = useRef(null);
    const restoreFocusRef = useRef(null);
    const pointerInsideRef = useRef(false);

    useEffect(() => {
        if (!open) {
            return undefined;
        }

        restoreFocusRef.current = document.activeElement;

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        const handleKeyDown = (event) => {
            if (event.key === "Escape" && dismissable) {
                onClose?.();
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        // Move focus into the dialog so keyboard users aren't left behind on
        // the page underneath.
        panelRef.current?.focus();

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            document.body.style.overflow = previousOverflow;

            const restore = restoreFocusRef.current;

            if (restore instanceof HTMLElement) {
                restore.focus();
            }
        };
    }, [open, dismissable, onClose]);

    if (!open) {
        return null;
    }

    const widths = {
        sm: "max-w-sm",
        md: "max-w-md",
        lg: "max-w-2xl",
        xl: "max-w-4xl",
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
            style={{
                animation:
                    "phase-in var(--duration-base) var(--ease-out-quart) both",
            }}
            onMouseDown={() => {
                pointerInsideRef.current = false;
            }}
            onClick={() => {
                if (dismissable && !pointerInsideRef.current) {
                    onClose?.();
                }
            }}
        >
            <div
                ref={panelRef}
                role="dialog"
                aria-modal="true"
                aria-label={typeof title === "string" ? title : undefined}
                tabIndex={-1}
                onMouseDown={(event) => {
                    event.stopPropagation();
                    pointerInsideRef.current = true;
                }}
                onClick={(event) => event.stopPropagation()}
                className={[
                    "flex max-h-[88vh] w-full flex-col overflow-hidden rounded-xl",
                    "border border-border-default bg-surface-overlay shadow-e4",
                    "outline-none",
                    widths[size],
                ].join(" ")}
                style={{
                    animation:
                        "evidence-drop var(--duration-base) var(--ease-spring) both",
                    ...(accent ? { borderTopColor: accent } : null),
                    ...(accent ? { borderTopWidth: "2px" } : null),
                }}
            >
                {(title || dismissable) && (
                    <header className="flex items-start gap-3 border-b border-border-subtle px-5 py-4">
                        {Icon && (
                            <span
                                className="mt-0.5 shrink-0"
                                style={accent ? { color: accent } : undefined}
                            >
                                <Icon size={20} />
                            </span>
                        )}

                        <div className="min-w-0 flex-1">
                            {title && (
                                <h2 className="truncate text-base font-semibold text-text-primary">
                                    {title}
                                </h2>
                            )}
                            {subtitle && (
                                <p className="mt-0.5 text-2xs text-text-muted">
                                    {subtitle}
                                </p>
                            )}
                        </div>

                        {dismissable && (
                            <button
                                type="button"
                                onClick={onClose}
                                aria-label="Close"
                                className="-mr-1 shrink-0 rounded-md p-1.5 text-text-muted transition-colors duration-fast hover:bg-white/5 hover:text-text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                            >
                                <X size={16} />
                            </button>
                        )}
                    </header>
                )}

                <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">
                    {children}
                </div>

                {footer && (
                    <footer className="border-t border-border-subtle px-5 py-4">
                        {footer}
                    </footer>
                )}
            </div>
        </div>
    );
}
