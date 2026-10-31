import { useState, type FormEvent } from "react"
import { useNavigate } from "react-router-dom"
import { createProduct } from "../../api/productsApi"
import type { ProductFormData } from "../../types"

function ProductCreate() {
  const navigate = useNavigate()

  const [name, setName] = useState("")
  const [price, setPrice] = useState("")
  const [category, setCategory] = useState("")
  const [stock, setStock] = useState("")
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const cleanName = name.trim()
    const cleanCategory = category.trim()
    const parsedPrice = Number(price)
    const parsedStock = Number(stock)

    setError("")

    if (!cleanName) {
      setError("Product name is required")
      return
    }

    if (price.trim() === "" || !Number.isFinite(parsedPrice) || parsedPrice < 0) {
      setError("Price must be a non-negative number")
      return
    }

    if (!cleanCategory) {
      setError("Product category is required")
      return
    }

    if (
      stock.trim() === "" ||
      !Number.isInteger(parsedStock) ||
      parsedStock < 0
    ) {
      setError("Stock must be a non-negative integer")
      return
    }

    const productData: ProductFormData = {
      name: cleanName,
      price: parsedPrice,
      category: cleanCategory,
      stock: parsedStock,
    }

    try {
      setIsSubmitting(true)
      await createProduct(productData)
      navigate("/products")
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to create product"

      setError(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="mx-auto max-w-xl">
      <h1 className="text-2xl font-bold text-heading">Create product</h1>

      <form
        onSubmit={handleSubmit}
        className="mt-6 space-y-5 rounded-xl border border-border bg-surface p-6"
      >
        <div>
          <label
            htmlFor="product-name"
            className="mb-2 block text-sm font-semibold text-heading"
          >
            Name
          </label>

          <input
            id="product-name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            disabled={isSubmitting}
            className="w-full rounded-lg border border-border px-3 py-2.5 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div>
          <label
            htmlFor="product-price"
            className="mb-2 block text-sm font-semibold text-heading"
          >
            Price
          </label>

          <input
            id="product-price"
            type="number"
            min="0"
            step="0.01"
            value={price}
            onChange={(event) => setPrice(event.target.value)}
            disabled={isSubmitting}
            className="w-full rounded-lg border border-border px-3 py-2.5 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div>
          <label
            htmlFor="product-category"
            className="mb-2 block text-sm font-semibold text-heading"
          >
            Category
          </label>

          <input
            id="product-category"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            disabled={isSubmitting}
            className="w-full rounded-lg border border-border px-3 py-2.5 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div>
          <label
            htmlFor="product-stock"
            className="mb-2 block text-sm font-semibold text-heading"
          >
            Stock
          </label>

          <input
            id="product-stock"
            type="number"
            min="0"
            step="1"
            value={stock}
            onChange={(event) => setStock(event.target.value)}
            disabled={isSubmitting}
            className="w-full rounded-lg border border-border px-3 py-2.5 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>

        {error && (
          <p role="alert" className="text-sm font-medium text-danger">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-lg bg-primary px-4 py-2.5 font-semibold text-on-primary hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Creating..." : "Create product"}
        </button>
      </form>
    </section>
  )
}

export default ProductCreate