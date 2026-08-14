import { useContext, useState } from "react";
import { AlertCircle, KeyRound, User } from "lucide-react";

import AuthContext from "../context/AuthContext";
import AuthLayout, { AuthLink } from "../components/auth/AuthLayout";
import { Button, Input } from "../components/ui";

/*
|--------------------------------------------------------------------------
| Login
|--------------------------------------------------------------------------
| Visual and UX pass only — the submit path still hands the raw form event
| straight to loginUser() from AuthContext, exactly as before. What is new:
| validation feedback while typing, a real loading state, and an error
| surface, since a failed sign-in previously produced no feedback at all.
*/

export default function Login() {
    const { loginUser } = useContext(AuthContext);

    const [values, setValues] = useState({ username: "", password: "" });
    const [touched, setTouched] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [formError, setFormError] = useState(null);

    const errors = {
        username: values.username.trim() ? null : "Enter your username.",
        password: values.password ? null : "Enter your password.",
    };

    const isValid = !errors.username && !errors.password;

    const handleChange = (field) => (event) => {
        setValues((prev) => ({ ...prev, [field]: event.target.value }));

        // Clear the server-side error as soon as the player edits anything —
        // leaving a stale "wrong password" under a field they have already
        // corrected reads as the form being broken.
        setFormError(null);
    };

    const handleBlur = (field) => () => {
        setTouched((prev) => ({ ...prev, [field]: true }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        setTouched({ username: true, password: true });

        if (!isValid) {
            return;
        }

        setSubmitting(true);
        setFormError(null);

        const result = await loginUser(event);

        // On success loginUser navigates away, so only the failure path needs
        // to put the form back into an editable state.
        if (result && !result.ok) {
            setFormError(result.error);
            setSubmitting(false);
            return;
        }

        setSubmitting(false);
    };

    return (
        <AuthLayout
            eyebrow="Verification Desk"
            title="Sign in to your desk"
            intro="Confirm who you are before joining an investigation. Your team needs to know whose findings they're trusting."
            footer={
                <>
                    No credentials yet?{" "}
                    <AuthLink to="/register">Request access</AuthLink>
                </>
            }
        >
            <form
                onSubmit={handleSubmit}
                noValidate
                className="flex flex-col gap-1"
            >
                <Input
                    label="Username"
                    name="username"
                    type="text"
                    autoComplete="username"
                    icon={User}
                    placeholder="your handle"
                    value={values.username}
                    onChange={handleChange("username")}
                    onBlur={handleBlur("username")}
                    error={touched.username ? errors.username : null}
                    valid={touched.username && !errors.username}
                    disabled={submitting}
                />

                <Input
                    label="Password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    icon={KeyRound}
                    placeholder="••••••••"
                    value={values.password}
                    onChange={handleChange("password")}
                    onBlur={handleBlur("password")}
                    error={touched.password ? errors.password : null}
                    valid={touched.password && !errors.password}
                    disabled={submitting}
                />

                {formError && (
                    <div
                        role="alert"
                        className="animate-phase-in mb-3 flex items-start gap-2 rounded-md border border-status-danger/30 bg-status-danger/10 px-3 py-2.5 text-2xs text-status-danger"
                    >
                        <AlertCircle size={14} className="mt-px shrink-0" />
                        <span>{formError}</span>
                    </div>
                )}

                <Button
                    type="submit"
                    size="lg"
                    fullWidth
                    loading={submitting}
                    disabled={submitting}
                >
                    {submitting ? "Verifying" : "Verify identity"}
                </Button>
            </form>
        </AuthLayout>
    );
}
