import { useId } from "react";
import { AlertCircle, Check } from "lucide-react";

/*
|--------------------------------------------------------------------------
| Input
|--------------------------------------------------------------------------
| A labelled field with room reserved for its own validation message, so a
| form doesn't jump when an error appears under a control the player is
| still typing into.
|
| States: default, focus, filled-valid, error, disabled. Validation state is
| carried by border colour *and* an icon — never colour alone.
*/

export default function Input({
    label,
    hint,
    error,
    valid = false,
    icon: Icon = null,
    className = "",
    id,
    ...rest
}) {
    const generatedId = useId();
    const inputId = id || generatedId;
    const messageId = `${inputId}-msg`;

    const state = error ? "error" : valid ? "valid" : "idle";

    const ringClass = {
        idle: "border-border-default focus-within:border-accent focus-within:shadow-glow-accent",
        valid: "border-status-success/50",
        error: "border-status-danger/60",
    }[state];

    return (
        <div className={`flex flex-col gap-1.5 ${className}`}>
            {label && (
                <label
                    htmlFor={inputId}
                    className="text-2xs font-medium uppercase tracking-wider text-text-secondary"
                >
                    {label}
                </label>
            )}

            <div
                className={[
                    "flex items-center gap-2.5 rounded-md border bg-surface-sunken px-3",
                    "transition-[border-color,box-shadow] duration-fast ease-out-quart",
                    "has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-60",
                    ringClass,
                ].join(" ")}
            >
                {Icon && (
                    <Icon
                        size={15}
                        className="shrink-0 text-text-muted"
                        aria-hidden="true"
                    />
                )}

                <input
                    id={inputId}
                    aria-invalid={!!error}
                    aria-describedby={error || hint ? messageId : undefined}
                    className={[
                        "w-full bg-transparent py-2.5 text-sm text-text-primary",
                        "outline-none placeholder:text-text-muted",
                        "disabled:cursor-not-allowed",
                    ].join(" ")}
                    {...rest}
                />

                {state === "valid" && (
                    <Check
                        size={15}
                        className="shrink-0 text-status-success"
                        aria-hidden="true"
                    />
                )}

                {state === "error" && (
                    <AlertCircle
                        size={15}
                        className="shrink-0 text-status-danger"
                        aria-hidden="true"
                    />
                )}
            </div>

            {/* Reserved line: keeps the field's height stable whether or not
                a message is currently showing. */}
            <p
                id={messageId}
                className={[
                    "min-h-4 text-2xs leading-4",
                    error ? "text-status-danger" : "text-text-muted",
                ].join(" ")}
            >
                {error || hint || " "}
            </p>
        </div>
    );
}
