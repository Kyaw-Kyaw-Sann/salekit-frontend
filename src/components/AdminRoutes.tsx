import { Navigate, Outlet } from "react-router-dom"
import type { AuthUser } from "../types"

type AdminRoutesProps = {
  currentUser: AuthUser | null
}

function AdminRoutes({ currentUser }: AdminRoutesProps) {
  if (!currentUser) {
    return <Navigate to="/login" replace />
  }

  if (currentUser.role !== "admin") {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}

export default AdminRoutes