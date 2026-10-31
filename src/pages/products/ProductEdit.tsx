import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ApiError } from "../../api/apiClient";
import { getProductById, updateProduct } from "../../api/productsApi";
import type { ProductFormData } from "../../types";

function ProductEdit() {
  const { productId } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [stock, setStock] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function loadProduct() {
      if (!productId) {
        setError("Product ID is required");
        setIsLoading(false);
        return;
      }

      try {
        const product = await getProductById(productId);

        setName(product.name);
        setPrice(String(product.price));
        setCategory(product.category);
        setStock(String(product.stock));
      } catch (error) {
        if (error instanceof ApiError && error.status === 404) {
          setError("Product not found");
          return;
        }

        const message =
          error instanceof Error ? error.message : "Failed to load product";

        setError(message);
      } finally {
        setIsLoading(false);
      }
    }

    loadProduct();
  }, [productId]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!productId) {
      setError("Product ID is required");
      return;
    }

    const cleanName = name.trim();
    const cleanCategory = category.trim();
    const parsedPrice = Number(price);
    const parsedStock = Number(stock);

    setError("");

    if (!cleanName) {
      setError("Product name is required");
      return;
    }

    if (
      price.trim() === "" ||
      !Number.isFinite(parsedPrice) ||
      parsedPrice < 0
    ) {
      setError("Price must be a non-negative number");
      return;
    }

    if (!cleanCategory) {
      setError("Product category is required");
      return;
    }

    if (
      stock.trim() === "" ||
      !Number.isInteger(parsedStock) ||
      parsedStock < 0
    ) {
      setError("Stock must be a non-negative integer");
      return;
    }

    const productData: ProductFormData = {
      name: cleanName,
      price: parsedPrice,
      category: cleanCategory,
      stock: parsedStock,
    };

    try {
      setIsSubmitting(true);
      await updateProduct(productId, productData);

      navigate(`/products/${encodeURIComponent(productId)}`);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to update product";

      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return <p>Loading product...</p>;
  }

  return (
    <section className="mx-auto max-w-xl">
      <Link to="/products" className="font-semibold text-primary">
        Back to products
      </Link>

      <h1 className="mt-4 text-2xl font-bold text-heading">Edit product</h1>

      {error === "Product not found" ? (
        <p role="alert" className="mt-6 font-medium text-danger">
          {error}
        </p>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="mt-6 space-y-5 rounded-xl border border-border bg-surface p-6"
        >
          <div>
            <label
              htmlFor="edit-name"
              className="mb-2 block text-sm font-semibold text-heading"
            >
              Name
            </label>

            <input
              id="edit-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              disabled={isSubmitting}
              className="w-full rounded-lg border border-border px-3 py-2.5 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div>
            <label
              htmlFor="edit-price"
              className="mb-2 block text-sm font-semibold text-heading"
            >
              Price
            </label>

            <input
              id="edit-price"
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
              htmlFor="edit-category"
              className="mb-2 block text-sm font-semibold text-heading"
            >
              Category
            </label>

            <input
              id="edit-category"
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              disabled={isSubmitting}
              className="w-full rounded-lg border border-border px-3 py-2.5 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div>
            <label
              htmlFor="edit-stock"
              className="mb-2 block text-sm font-semibold text-heading"
            >
              Stock
            </label>

            <input
              id="edit-stock"
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
            {isSubmitting ? "Saving..." : "Save changes"}
          </button>
        </form>
      )}
    </section>
  );
}

export default ProductEdit;
