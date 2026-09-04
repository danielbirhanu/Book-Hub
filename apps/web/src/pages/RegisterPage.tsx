import { ArrowRight, UserRound } from "lucide-react";
import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { AppButton } from "../ui/Button";
import { Field } from "../ui/Field";

export function RegisterPage() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setBusy(true);
    const data = Object.fromEntries(new FormData(event.currentTarget));
    const response = await fetch("/api/v1/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(data),
    });
    setBusy(false);
    if (!response.ok) {
      const payload = (await response.json()) as {
        error?: { message?: string };
      };
      setError(payload.error?.message ?? "Unable to create account.");
      return;
    }
    void navigate("/my-books");
  }
  return (
    <div className="auth-form-wrap">
      <p className="eyebrow">Start your library</p>
      <h1>Make room for better recommendations.</h1>
      <p className="auth-intro">
        Create an account to keep your shelves, ratings, and reviews in one
        place.
      </p>
      <form className="auth-form" onSubmit={(event) => void submit(event)}>
        <Field
          autoComplete="name"
          label="Display name"
          name="username"
          required
        />
        <Field
          autoComplete="email"
          label="Email address"
          name="email"
          required
          type="email"
        />
        <Field
          autoComplete="new-password"
          label="Password"
          name="password"
          required
          type="password"
          hint="Use at least 8 characters."
        />
        {error ? (
          <p className="form-error" role="alert">
            {error}
          </p>
        ) : null}
        <AppButton
          disabled={busy}
          icon={<UserRound aria-hidden="true" size={18} />}
          size="large"
          type="submit"
        >
          {busy ? "Creating account..." : "Create account"}{" "}
          <ArrowRight aria-hidden="true" size={18} />
        </AppButton>
      </form>
      <p className="auth-switch">
        Already a member? <Link to="/login">Sign in</Link>
      </p>
    </div>
  );
}
