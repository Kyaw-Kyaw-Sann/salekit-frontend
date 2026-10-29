import { Navigate, Outlet } from "react-router-dom"
import type { AuthUser } from "../types"

type ProtectedRouteProps = {
  currentUser: AuthUser | null
  authLoading: boolean
}

function ProtectedRoute({
  currentUser,
  authLoading,
}: ProtectedRouteProps) {
  if (authLoading) {
    return <p>Checking session...</p>
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}

export default ProtectedRoute