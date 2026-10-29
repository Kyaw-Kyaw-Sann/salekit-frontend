import { useState, type FormEvent } from "react"
import { Link } from "react-router-dom"
import { forgotPassword } from "../../api/authApi"

function ForgotPassword() {
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const cleanEmail = email.trim().toLowerCase()

    setError("")
    setSuccessMessage("")

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setError("A valid email is required")
      return
    }

    if (cleanEmail.length > 255) {
      setError("Email must not exceed 255 characters")
      return
    }

    try {
      setIsSubmitting(true)

      const message = await forgotPassword({
        email: cleanEmail,
      })

      setSuccessMessage(message)
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to request password reset"

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
            Forgot password
          </h1>

          <p className="mt-2 text-sm text-body">
            Enter your email to request a password reset OTP.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          noValidate
          className="space-y-5"
        >
          <div>
            <label
              htmlFor="forgot-email"
              className="mb-2 block text-sm font-semibold text-heading"
            >
              Email address
            </label>

            <input
              id="forgot-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              disabled={isSubmitting}
              maxLength={255}
              className="w-full rounded-lg border border-border px-3 py-2.5 text-heading outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60"
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
            disabled={isSubmitting}
            className="w-full rounded-lg bg-primary px-4 py-2.5 font-semibold text-on-primary transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Sending OTP..." : "Send reset OTP"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-body">
          Already have a reset OTP?{" "}
          <Link
            to="/reset-password"
            className="font-semibold text-primary hover:text-primary-hover"
          >
            Reset password
          </Link>
        </p>

        <p className="mt-2 text-center text-sm text-body">
          Remember your password?{" "}
          <Link
            to="/login"
            className="font-semibold text-primary hover:text-primary-hover"
          >
            Login
          </Link>
        </p>
      </section>
    </main>
  )
}

export default ForgotPassword
