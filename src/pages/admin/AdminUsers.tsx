import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { getAdminUsers } from "../../api/adminApi"
import type { AdminUser } from "../../types"

function AdminUsers() {
  const [users, setUsers] = useState<AdminUser[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    async function loadUsers() {
      try {
        const userList = await getAdminUsers()
        setUsers(userList)
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Failed to load users"

        setError(message)
      } finally {
        setIsLoading(false)
      }
    }

    loadUsers()
  }, [])

  if (isLoading) {
    return <p>Loading users...</p>
  }

  if (error) {
    return (
      <p role="alert" className="font-medium text-danger">
        {error}
      </p>
    )
  }

  return (
    <section>
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-heading">
            Users
          </h1>

          <p className="mt-2 text-body">
            Read-only user account list.
          </p>
        </div>

        <Link to="/admin" className="font-semibold text-primary">
          Admin dashboard
        </Link>
      </div>

      {users.length === 0 ? (
        <p className="mt-6 text-body">No users found.</p>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-xl border border-border bg-surface">
          <table className="w-full text-left">
            <thead className="border-b border-border bg-background">
              <tr>
                <th className="px-4 py-3 text-sm text-heading">
                  Name
                </th>

                <th className="px-4 py-3 text-sm text-heading">
                  Email
                </th>

                <th className="px-4 py-3 text-sm text-heading">
                  Role
                </th>

                <th className="px-4 py-3 text-sm text-heading">
                  Status
                </th>
              </tr>
            </thead>

            <tbody>
              {users.map((user) => (
                <tr
                  key={user.id}
                  className="border-b border-border last:border-b-0"
                >
                  <td className="px-4 py-3 font-medium text-heading">
                    {user.name}
                  </td>

                  <td className="px-4 py-3 text-body">
                    {user.email}
                  </td>

                  <td className="px-4 py-3 capitalize text-body">
                    {user.role}
                  </td>

                  <td className="px-4 py-3">
                    <span
                      className={
                        user.isVerified
                          ? "font-medium text-success"
                          : "font-medium text-warning"
                      }
                    >
                      {user.isVerified ? "Verified" : "Unverified"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}

export default AdminUsers