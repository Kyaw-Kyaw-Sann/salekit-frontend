import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { getProducts } from "../api/productsApi"
import type { Product } from "../types"

type DashboardProps = {
  userName: string
}

const LOW_STOCK_LIMIT = 5

function Dashboard({ userName }: DashboardProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    async function loadProducts() {
      try {
        const productList = await getProducts()
        setProducts(productList)
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Failed to load dashboard"

        setError(message)
      } finally {
        setIsLoading(false)
      }
    }

    loadProducts()
  }, [])

  if (isLoading) {
    return <p>Loading dashboard...</p>
  }

  if (error) {
    return <p role="alert">{error}</p>
  }

  const totalProducts = products.length

  const totalStock = products.reduce(
    (total, product) => total + product.stock,
    0,
  )

  const lowStockProducts = products.filter(
    (product) => product.stock <= LOW_STOCK_LIMIT,
  ).length

  return (
    <section>
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-heading">
            Dashboard
          </h1>

          <p className="mt-2 text-body">
            Welcome, {userName}
          </p>
        </div>

        <Link
          to="/products"
          className="rounded-lg bg-primary px-4 py-2 font-semibold text-on-primary hover:bg-primary-hover"
        >
          Manage products
        </Link>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <article className="rounded-xl border border-border bg-surface p-5">
          <p className="text-sm font-semibold text-muted">
            Total products
          </p>

          <p className="mt-2 text-3xl font-bold text-heading">
            {totalProducts}
          </p>
        </article>

        <article className="rounded-xl border border-border bg-surface p-5">
          <p className="text-sm font-semibold text-muted">
            Total stock
          </p>

          <p className="mt-2 text-3xl font-bold text-heading">
            {totalStock}
          </p>
        </article>

        <article className="rounded-xl border border-border bg-surface p-5">
          <p className="text-sm font-semibold text-muted">
            Low-stock products
          </p>

          <p className="mt-2 text-3xl font-bold text-warning">
            {lowStockProducts}
          </p>
        </article>
      </div>
    </section>
  )
}

export default Dashboard