import { useState, type FormEvent } from "react"
import { Link } from "react-router-dom"
import type { SignupData } from "../../types"

type SignupProps = {
  onSignup: (signupData: SignupData) => Promise<void>
}

function Signup({ onSignup }: SignupProps) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const cleanName = name.trim()
    const cleanEmail = email.trim().toLowerCase()

    if (!cleanName) {
      setError("Name is required")
      return
    }

    if (cleanName.length > 100) {
      setError("Name must not exceed 100 characters")
      return
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setError("Valid email is required")
      return
    }

    if (cleanEmail.length > 255) {
      setError("Email must not exceed 255 characters")
      return
    }

    if (password.length < 8) {
      setError("Password must contain at least 8 characters")
      return
    }

    if (new TextEncoder().encode(password).length > 72) {
      setError("Password must not exceed 72 bytes")
      return
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    try {
      setError("")
      setIsSubmitting(true)

      await onSignup({
        name: cleanName,
        email: cleanEmail,
        password,
      })
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to signup"

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
            Create account
          </h1>

          <p className="mt-2 text-sm text-body">
            Create your account to manage products.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          noValidate
          className="space-y-4"
        >
          <div>
            <label
              htmlFor="name"
              className="mb-2 block text-sm font-semibold text-heading"
            >
              Name
            </label>

            <input
              id="name"
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              autoComplete="name"
              disabled={isSubmitting}
              maxLength={100}
              className="w-full rounded-lg border border-border px-3 py-2.5 text-heading outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:opacity-60"
            />
          </div>

          <div>
            <label
              htmlFor="signup-email"
              className="mb-2 block text-sm font-semibold text-heading"
            >
              Email address
            </label>

            <input
              id="signup-email"
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
              htmlFor="signup-password"
              className="mb-2 block text-sm font-semibold text-heading"
            >
              Password
            </label>

            <input
              id="signup-password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="new-password"
              disabled={isSubmitting}
              className="w-full rounded-lg border border-border px-3 py-2.5 text-heading outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:opacity-60"
            />
          </div>

          <div>
            <label
              htmlFor="confirm-password"
              className="mb-2 block text-sm font-semibold text-heading"
            >
              Confirm password
            </label>

            <input
              id="confirm-password"
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
            {isSubmitting ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-body">
          Already have an account?{" "}
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

export default Signup