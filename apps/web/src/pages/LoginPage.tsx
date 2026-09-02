import { Eye, LockKeyhole } from "lucide-react";
import { Link } from "react-router-dom";

import { AppButton } from "../ui/Button";
import { Field } from "../ui/Field";

export function LoginPage() {
  return (
    <div className="auth-form-wrap">
      <p className="eyebrow">Welcome back</p>
      <h1>Continue your reading life.</h1>
      <p className="auth-intro">
        Sign in to update your shelves and join the conversation.
      </p>
      <form className="auth-form" onSubmit={(event) => event.preventDefault()}>
        <Field
          autoComplete="email"
          label="Email address"
          name="email"
          type="email"
        />
        <div className="password-field-wrap">
          <Field
            autoComplete="current-password"
            label="Password"
            name="password"
            type="password"
          />
          <button
            aria-label="Show password"
            className="password-toggle"
            type="button"
          >
            <Eye aria-hidden="true" size={18} />
          </button>
        </div>
        <div className="form-row">
          <label className="check-control">
            <input name="remember" type="checkbox" />
            <span>Remember me</span>
          </label>
          <Link className="inline-link" to="/forgot-password">
            Forgot password?
          </Link>
        </div>
        <AppButton
          icon={<LockKeyhole aria-hidden="true" size={18} />}
          size="large"
          type="submit"
        >
          Sign in
        </AppButton>
      </form>
      <p className="auth-switch">
        New to Book Hub? <Link to="/register">Create an account</Link>
      </p>
    </div>
  );
}
