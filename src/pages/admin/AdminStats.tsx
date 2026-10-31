import { useEffect, useState } from "react";
import { getAdminStats } from "../../api/adminApi";
import type { AdminStats as AdminStatsData } from "../../types";
import { Link } from "react-router-dom";

function AdminStats() {
  const [stats, setStats] = useState<AdminStatsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadStats() {
      try {
        const adminStats = await getAdminStats();
        setStats(adminStats);
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Failed to load admin stats";

        setError(message);
      } finally {
        setIsLoading(false);
      }
    }

    loadStats();
  }, []);

  if (isLoading) {
    return <p>Loading admin stats...</p>;
  }

  if (error) {
    return (
      <p role="alert" className="font-medium text-danger">
        {error}
      </p>
    );
  }

  if (!stats) {
    return null;
  }

  return (
    <section>
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-heading">Admin dashboard</h1>

          <p className="mt-2 text-body">
            System-wide account and product statistics.
          </p>
        </div>

        <Link
          to="/admin/users"
          className="rounded-lg bg-primary px-4 py-2 font-semibold text-on-primary hover:bg-primary-hover"
        >
          View users
        </Link>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <article className="rounded-xl border border-border bg-surface p-5">
          <p className="text-sm font-semibold text-muted">Total users</p>

          <p className="mt-2 text-3xl font-bold text-heading">
            {stats.totalUsers}
          </p>
        </article>

        <article className="rounded-xl border border-border bg-surface p-5">
          <p className="text-sm font-semibold text-muted">Verified users</p>

          <p className="mt-2 text-3xl font-bold text-success">
            {stats.verifiedUsers}
          </p>
        </article>

        <article className="rounded-xl border border-border bg-surface p-5">
          <p className="text-sm font-semibold text-muted">Total products</p>

          <p className="mt-2 text-3xl font-bold text-heading">
            {stats.totalProducts}
          </p>
        </article>
      </div>
    </section>
  );
}

export default AdminStats;
