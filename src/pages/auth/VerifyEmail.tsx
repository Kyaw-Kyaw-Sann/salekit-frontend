import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import type { VerifyEmailData } from "../../types";
import { resendVerificationOtp } from "../../api/authApi";

type VerifyEmailProps = {
  initialEmail?: string;
  onVerify: (verificationData: VerifyEmailData) => Promise<void>;
};

function VerifyEmail({ initialEmail = "", onVerify }: VerifyEmailProps) {
  const [email, setEmail] = useState(initialEmail);
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setSuccessMessage("")

    const cleanEmail = email.trim().toLowerCase();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setError("A valid email is required");
      return;
    }

    if (!/^\d{6}$/.test(otp)) {
      setError("OTP must contain exactly 6 digits");
      return;
    }

    try {
      setError("");
      setIsSubmitting(true);

      await onVerify({
        email: cleanEmail,
        otp,
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to verify email";

      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleResend() {
    const cleanEmail = email.trim().toLowerCase();

    setSuccessMessage("");

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setError("A valid email is required");
      return;
    }

    try {
      setError("");
      setIsResending(true);

      const message = await resendVerificationOtp({
        email: cleanEmail,
      });

      setSuccessMessage(message);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to resend verification OTP";

      setError(message);
    } finally {
      setIsResending(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-10">
      <section className="w-full max-w-md rounded-2xl border border-border bg-surface p-6 shadow-lg sm:p-8">
        <div className="mb-8 text-center">
          <p className="mb-2 text-sm font-bold uppercase tracking-widest text-primary">
            SaleKit
          </p>

          <h1 className="text-3xl font-bold text-heading">Verify your email</h1>

          <p className="mt-2 text-sm text-body">
            Enter the six-digit OTP sent to your email.
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          <div>
            <label
              htmlFor="verification-email"
              className="mb-2 block text-sm font-semibold text-heading"
            >
              Email address
            </label>

            <input
              id="verification-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
             disabled={isSubmitting || isResending}
              maxLength={255}
              className="w-full rounded-lg border border-border px-3 py-2.5 text-heading outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:opacity-60"
            />
          </div>

          <div>
            <label
              htmlFor="verification-otp"
              className="mb-2 block text-sm font-semibold text-heading"
            >
              Verification OTP
            </label>

            <input
              id="verification-otp"
              type="text"
              value={otp}
              onChange={(event) => {
                const digits = event.target.value
                  .replace(/\D/g, "")
                  .slice(0, 6);

                setOtp(digits);
              }}
              inputMode="numeric"
              autoComplete="one-time-code"
              disabled={isSubmitting || isResending}
              maxLength={6}
              className="w-full rounded-lg border border-border px-3 py-2.5 text-center text-2xl font-semibold tracking-[0.5em] text-heading outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:opacity-60"
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
           disabled={isSubmitting || isResending}
            className="w-full rounded-lg bg-primary px-4 py-2.5 font-semibold text-on-primary transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Verifying..." : "Verify email"}
          </button>
          <button
            type="button"
            onClick={handleResend}
            disabled={isSubmitting || isResending}
            className="w-full rounded-lg border border-primary px-4 py-2.5 font-semibold text-primary transition hover:bg-primary/5 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isResending ? "Sending new OTP..." : "Resend OTP"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-body">
          Already verified?{" "}
          <Link
            to="/login"
            className="font-semibold text-primary hover:text-primary-hover"
          >
            Login
          </Link>
        </p>
      </section>
    </main>
  );
}

export default VerifyEmail;
