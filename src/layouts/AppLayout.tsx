import { useState } from "react"
import { NavLink, Outlet } from "react-router-dom"
import type { AuthUser } from "../types"

type AppLayoutProps = {
  currentUser: AuthUser | null
  onLogout: () => Promise<void>
}

function AppLayout({
  currentUser,
  onLogout,
}: AppLayoutProps) {
  
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [logoutError, setLogoutError] = useState("")

  async function handleLogoutClick() {
    try {
      setLogoutError("")
      setIsLoggingOut(true)

      await onLogout()
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to logout"

      setLogoutError(message)
    } finally {
      setIsLoggingOut(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-surface">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <NavLink
            to="/"
            className="text-xl font-bold text-primary"
          >
            SaleKit
          </NavLink>

          <div className="flex items-center gap-4">
            <NavLink
              to="/"
              className="text-sm font-medium text-body transition hover:text-primary"
            >
              Dashboard
            </NavLink>

            {currentUser && (
              <div className="text-right">
                <p className="text-sm font-semibold text-heading">
                  {currentUser.name}
                </p>

                <p className="text-xs capitalize text-muted">
                  {currentUser.role}
                </p>
              </div>
            )}

            <button
              type="button"
              onClick={handleLogoutClick}
              disabled={isLoggingOut}
              className="rounded-lg border border-border px-3 py-2 text-sm font-medium text-body transition hover:border-danger hover:text-danger disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoggingOut ? "Logging out..." : "Logout"}
            </button>
          </div>
        </div>

        {logoutError && (
          <p
            role="alert"
            className="mx-auto max-w-6xl px-4 pb-3 text-sm font-medium text-danger"
          >
            {logoutError}
          </p>
        )}
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">
        <Outlet />
      </main>
    </div>
  )
}

export default AppLayout