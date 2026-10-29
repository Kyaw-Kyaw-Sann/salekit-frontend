import { useState, type FormEvent } from "react"
import { Link, useNavigate } from "react-router-dom"
import { resetPassword } from "../../api/authApi"

function ResetPassword() {
  const navigate = useNavigate()

  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const cleanEmail = email.trim().toLowerCase()

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setError("A valid email is required")
      return
    }

    if (!/^\d{6}$/.test(otp)) {
      setError("OTP must contain exactly 6 digits")
      return
    }

    if (newPassword.length < 8) {
      setError("New password must contain at least 8 characters")
      return
    }

    if (new TextEncoder().encode(newPassword).length > 72) {
      setError("New password must not exceed 72 bytes")
      return
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    try {
      setError("")
      setIsSubmitting(true)

      const message = await resetPassword({
        email: cleanEmail,
        otp,
        newPassword,
      })

      navigate("/login", {
        replace: true,
        state: {
          successMessage: message,
        },
      })
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to reset password"

      setError(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-10">
      <section className="w-full max-w-md rounded-2xl border border-border bg-surface p-6 shadow-lg sm:p-8">
        <div className="mb-8 text-center">
          <p className="mb-2 text-sm font-bold uppercase tracking-widest text-primary">
            SaleKit
          </p>

          <h1 className="text-3xl font-bold text-heading">
            Reset password
          </h1>

          <p className="mt-2 text-sm text-body">
            Enter your reset OTP and choose a new password.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          noValidate
          className="space-y-4"
        >
          <div>
            <label
              htmlFor="reset-email"
              className="mb-2 block text-sm font-semibold text-heading"
            >
              Email address
            </label>

            <input
              id="reset-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              disabled={isSubmitting}
              maxLength={255}
              className="w-full rounded-lg border border-border px-3 py-2.5 text-heading outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:opacity-60"
            />
          </div>

          <div>
            <label
              htmlFor="reset-otp"
              className="mb-2 block text-sm font-semibold text-heading"
            >
              Reset OTP
            </label>

            <input
              id="reset-otp"
              type="text"
              value={otp}
              onChange={(event) => {
                const digits = event.target.value
                  .replace(/\D/g, "")
                  .slice(0, 6)

                setOtp(digits)
              }}
              inputMode="numeric"
              autoComplete="one-time-code"
              disabled={isSubmitting}
              maxLength={6}
              className="w-full rounded-lg border border-border px-3 py-2.5 text-center text-2xl font-semibold tracking-[0.5em] text-heading outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:opacity-60"
            />
          </div>

          <div>
            <label
              htmlFor="new-password"
              className="mb-2 block text-sm font-semibold text-heading"
            >
              New password
            </label>

            <input
              id="new-password"
              type="password"
              value={newPassword}
              onChange={(event) =>
                setNewPassword(event.target.value)
              }
              autoComplete="new-password"
              disabled={isSubmitting}
              className="w-full rounded-lg border border-border px-3 py-2.5 text-heading outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:opacity-60"
            />
          </div>

          <div>
            <label
              htmlFor="confirm-new-password"
              className="mb-2 block text-sm font-semibold text-heading"
            >
              Confirm new password
            </label>

            <input
              id="confirm-new-password"
              type="password"
              value={confirmPassword}
              onChange={(event) =>
                setConfirmPassword(event.target.value)
              }
              autoComplete="new-password"
              disabled={isSubmitting}
              className="w-full rounded-lg border border-border px-3 py-2.5 text-heading outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:opacity-60"
            />
          </div>

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
            disabled={isSubmitting}
            className="w-full rounded-lg bg-primary px-4 py-2.5 font-semibold text-on-primary transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Resetting password..." : "Reset password"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-body">
          <Link
            to="/login"
            className="font-semibold text-primary hover:text-primary-hover"
          >
            Back to login
          </Link>
        </p>
      </section>
    </main>
  )
}

export default ResetPassword