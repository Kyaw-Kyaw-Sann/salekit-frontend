import { useState, type FormEvent } from "react";
import type { LoginData } from "../../types";
import { Link, useLocation } from "react-router-dom";

type LoginProps = {
  onLogin: (loginData: LoginData) => Promise<void>;
};

function getSuccessMessage(state: unknown) {
  if (
    typeof state === "object" &&
    state !== null &&
    "successMessage" in state &&
    typeof state.successMessage === "string"
  ) {
    return state.successMessage;
  }

  return "";
}

function Login({ onLogin }: LoginProps) {
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState(() =>
    getSuccessMessage(location.state),
  );
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSuccessMessage("");

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail || !password) {
      setError("Email or password is required.");
      return;
    }

    try {
      setError("");
      setSubmitted(true);

      await onLogin({
        email: cleanEmail,
        password,
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to login";

      setError(message);
    } finally {
      setSubmitted(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-10">
      <section className="w-full max-w-md rounded-2xl border border-border bg-surface p-6 shadow-lg sm:p-8">
        <div className="mb-8 text-center">
          <p className="mb-2 text-sm font-bold uppercase tracking-widest text-primary">
            SaleKit
          </p>
          <h1 className="text-3xl font-bold text-heading">Welcome back</h1>
          <p className="mt-2 text-sm text-body">
            Login with your verified account.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-semibold text-heading"
            >
              Email address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              disabled={submitted}
              required
              autoComplete="email"
              placeholder="you@example.com"
              className="w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-heading outline-none transition placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-semibold text-heading"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              disabled={submitted}
              required
              autoComplete="current-password"
              placeholder="Enter your password"
              className="w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-heading outline-none transition placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60"
            />
          </div>

          {successMessage && (
            <p
              aria-live="polite"
              className="rounded-lg border border-success/20 bg-success/5 px-3 py-2.5 text-sm font-medium text-success"
            >
              {successMessage}
            </p>
          )}

          {error && (
            <p
              role="alert"
              className="rounded-lg border border-danger/20 bg-danger/5 px-3 py-2.5 text-sm font-medium text-danger"
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitted}
            className="w-full rounded-lg bg-primary px-4 py-2.5 font-semibold text-on-primary transition-colors hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitted ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="mt-6 space-y-2 text-center text-sm text-body">
          <p>
            Don&apos;t have an account?{" "}
            <Link
              to="/signup"
              className="font-semibold text-primary hover:text-primary-hover"
            >
              Create account
            </Link>
          </p>

          <p>
            <Link
              to="/verify-email"
              className="font-semibold text-primary hover:text-primary-hover"
            >
              Verify an existing account
            </Link>
          </p>

          <p>
            <Link
              to="/forgot-password"
              className="font-semibold text-primary hover:text-primary-hover"
            >
              Forgot password?
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}

export default Login;
