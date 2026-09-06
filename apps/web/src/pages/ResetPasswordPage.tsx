import { FormEvent, useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { AppButton } from "../ui/Button";
import { Field } from "../ui/Field";

export function ResetPasswordPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.currentTarget));
    const response = await fetch("/api/v1/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        token: params.get("token"),
        password: data.password,
      }),
    });
    const payload = (await response.json()) as {
      message?: string;
      error?: { message?: string };
    };
    setMessage(
      payload.message ?? payload.error?.message ?? "Unable to reset password."
    );
    if (response.ok) setTimeout(() => void navigate("/login"), 1200);
  }
  return (
    <div className="auth-form-wrap">
      <p className="eyebrow">Account recovery</p>
      <h1>Choose a new password.</h1>
      <form className="auth-form" onSubmit={(event) => void submit(event)}>
        <Field
          autoComplete="new-password"
          label="New password"
          name="password"
          type="password"
          required
          minLength={8}
        />
        <AppButton size="large" type="submit">
          Update password
        </AppButton>
        {message && <p role="status">{message}</p>}
      </form>
      <p className="auth-switch">
        <Link to="/login">Back to sign in</Link>
      </p>
    </div>
  );
}
