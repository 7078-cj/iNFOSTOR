import { useContext, useState } from "react";
import { AlertCircle, AtSign, KeyRound, User } from "lucide-react";

import AuthContext from "../context/AuthContext";
import AuthLayout, { AuthLink } from "../components/auth/AuthLayout";
import { Button, Input } from "../components/ui";

/*
|--------------------------------------------------------------------------
| Register
|--------------------------------------------------------------------------
| Same registration request as before — POST to register/, then hand the
| event to loginUser() on success. The rewrite is presentational plus real
| validation and error reporting; the previous version parsed the response
| but only acted on status 200 and silently dropped every failure.
*/

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Register() {
    const { loginUser } = useContext(AuthContext);

    const [values, setValues] = useState({
        username: "",
        email: "",
        password: "",
    });

    const [touched, setTouched] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [formError, setFormError] = useState(null);

    const errors = {
        username:
            values.username.trim().length >= 3
                ? null
                : "At least 3 characters.",
        email: EMAIL_PATTERN.test(values.email)
            ? null
            : "Enter a valid email address.",
        password:
            values.password.length >= 8
                ? null
                : "At least 8 characters.",
    };

    const isValid = !errors.username && !errors.email && !errors.password;

    const handleChange = (field) => (event) => {
        setValues((prev) => ({ ...prev, [field]: event.target.value }));
        setFormError(null);
    };

    const handleBlur = (field) => () => {
        setTouched((prev) => ({ ...prev, [field]: true }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        setTouched({ username: true, email: true, password: true });

        if (!isValid) {
            return;
        }

        setSubmitting(true);
        setFormError(null);

        const url = import.meta.env.VITE_API_URL;

        try {
            const response = await fetch(`${url}register/`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    username: values.username.trim(),
                    email: values.email.trim(),
                    password: values.password,
                }),
            });

            const data = await response.json().catch(() => null);

            if (!response.ok) {
                // DRF returns field errors as arrays; surface the first one
                // rather than dropping it the way the old version did.
                const firstFieldError =
                    data &&
                    Object.values(data)
                        .flat()
                        .find((entry) => typeof entry === "string");

                setFormError(
                    firstFieldError ||
                        "Could not create that account. Try different details."
                );
                setSubmitting(false);
                return;
            }

            await loginUser(event);
        } catch (error) {
            console.error("Error during registration:", error);
            setFormError(
                "Could not reach the server. Check your connection and try again."
            );
        }

        setSubmitting(false);
    };

    return (
        <AuthLayout
            eyebrow="Verification Desk"
            title="Request desk access"
            intro="New investigators get a credential and a role. You won't know which role until the first case lands."
            footer={
                <>
                    Already cleared? <AuthLink to="/login">Sign in</AuthLink>
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
                    placeholder="how the team sees you"
                    value={values.username}
                    onChange={handleChange("username")}
                    onBlur={handleBlur("username")}
                    error={touched.username ? errors.username : null}
                    valid={touched.username && !errors.username}
                    disabled={submitting}
                />

                <Input
                    label="Email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    icon={AtSign}
                    placeholder="you@example.com"
                    value={values.email}
                    onChange={handleChange("email")}
                    onBlur={handleBlur("email")}
                    error={touched.email ? errors.email : null}
                    valid={touched.email && !errors.email}
                    disabled={submitting}
                />

                <Input
                    label="Password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    icon={KeyRound}
                    placeholder="at least 8 characters"
                    hint="Minimum 8 characters."
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
                    {submitting ? "Issuing credential" : "Create credential"}
                </Button>
            </form>
        </AuthLayout>
    );
}
