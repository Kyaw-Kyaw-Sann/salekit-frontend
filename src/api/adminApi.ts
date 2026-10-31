import { apiRequest } from "./apiClient"
import type { AdminStats, AdminUser } from "../types"

export function getAdminStats() {
  return apiRequest<AdminStats>("/admin/stats")
}

export async function getAdminUsers() {
  const response = await apiRequest<{ users: AdminUser[] }>(
    "/admin/users",
  )

  return response.users
}