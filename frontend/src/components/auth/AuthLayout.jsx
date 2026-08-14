import { Link } from "react-router-dom";
import { PhaseInvestigationIcon } from "../icons";

/*
|--------------------------------------------------------------------------
| AuthLayout
|--------------------------------------------------------------------------
| Shared frame for sign-in and registration. Previously these two screens
| were the only light-themed surfaces in the app — a white form handing the
| player straight into a dark investigation board.
|
| Framed as clearance rather than "account management": the player is being
| checked in at a verification desk before being given a case. The copy does
| the theming; the layout stays a plain, fast, legible form, because an auth
| screen that fights the user is a bad auth screen no matter how on-theme it
| is.
*/

export default function AuthLayout({
    eyebrow,
    title,
    intro,
    children,
    footer,
}) {
    return (
        <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-surface-base p-4">
            {/* Ambient backdrop: a faint case-file grid. Pure CSS, no image
                payload, and it sits behind everything at low contrast so it
                never competes with the form. */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 opacity-[0.35]"
                style={{
                    backgroundImage:
                        "linear-gradient(var(--color-border-subtle) 1px, transparent 1px), linear-gradient(90deg, var(--color-border-subtle) 1px, transparent 1px)",
                    backgroundSize: "48px 48px",
                    maskImage:
                        "radial-gradient(ellipse 80% 60% at 50% 40%, black, transparent)",
                }}
            />

            <div
                aria-hidden="true"
                className="pointer-events-none absolute left-1/2 top-0 h-72 w-[36rem] -translate-x-1/2 rounded-full opacity-20 blur-3xl"
                style={{
                    background:
                        "radial-gradient(circle, var(--color-accent), transparent 70%)",
                }}
            />

            <main className="animate-phase-in relative w-full max-w-sm">
                <div className="mb-6 flex flex-col items-center gap-3 text-center">
                    <span className="grid h-12 w-12 place-items-center rounded-lg border border-accent/30 bg-accent-muted text-accent">
                        <PhaseInvestigationIcon size={24} />
                    </span>

                    <div>
                        <div className="text-2xs font-medium uppercase tracking-[0.2em] text-text-muted">
                            {eyebrow}
                        </div>
                        <h1 className="mt-1 text-xl font-semibold tracking-tight text-text-primary">
                            {title}
                        </h1>
                    </div>

                    {intro && (
                        <p className="max-w-[34ch] font-serif text-sm leading-relaxed text-text-secondary">
                            {intro}
                        </p>
                    )}
                </div>

                <div className="rounded-xl border border-border-default bg-surface-raised p-6 shadow-e3">
                    {children}
                </div>

                {footer && (
                    <p className="mt-5 text-center text-2xs text-text-muted">
                        {footer}
                    </p>
                )}
            </main>
        </div>
    );
}

/*
| Inline link styling used in the auth footers, kept here so both screens
| render it identically.
*/

export function AuthLink({ to, children }) {
    return (
        <Link
            to={to}
            className="rounded-sm text-accent underline-offset-4 transition-colors duration-fast hover:text-accent-hover hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
            {children}
        </Link>
    );
}
