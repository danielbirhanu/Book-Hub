import { FormEvent, useState } from "react";
import { Link } from "react-router-dom";
import { AppButton } from "../ui/Button";
import { Field } from "../ui/Field";

export function ForgotPasswordPage() {
  const [message, setMessage] = useState("");
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.currentTarget));
    const response = await fetch("/api/v1/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const payload = (await response.json()) as { message?: string };
    setMessage(
      payload.message ?? "If an account exists, a reset link will be sent."
    );
  }
  return (
    <div className="auth-form-wrap">
      <p className="eyebrow">Account recovery</p>
      <h1>Reset your password.</h1>
      <p className="auth-intro">
        Enter your email and we will send a reset link if the account exists.
      </p>
      <form className="auth-form" onSubmit={(event) => void submit(event)}>
        <Field
          autoComplete="email"
          label="Email address"
          name="email"
          type="email"
          required
        />
        <AppButton size="large" type="submit">
          Send reset link
        </AppButton>
        {message && <p role="status">{message}</p>}
      </form>
      <p className="auth-switch">
        <Link to="/login">Back to sign in</Link>
      </p>
    </div>
  );
}
