import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ApiError } from "../../api/apiClient";
import { deleteProduct, getProductById } from "../../api/productsApi";
import type { Product } from "../../types";

function ProductDetail() {
  const { productId } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    async function loadProduct() {
      if (!productId) {
        setError("Product ID is required");
        setIsLoading(false);
        return;
      }

      try {
        const productData = await getProductById(productId);
        setProduct(productData);
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

  async function handleDelete() {
    if (!product) {
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete "${product.name}"?`,
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeleteError("");
      setIsDeleting(true);

      await deleteProduct(product.id);
      navigate("/products");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to delete product";

      setDeleteError(message);
    } finally {
      setIsDeleting(false);
    }
  }

  if (isLoading) {
    return <p>Loading product...</p>;
  }

  if (error) {
    return (
      <section>
        <p role="alert" className="font-medium text-danger">
          {error}
        </p>

        <Link
          to="/products"
          className="mt-4 inline-block font-semibold text-primary"
        >
          Back to products
        </Link>
      </section>
    );
  }

  if (!product) {
    return null;
  }

  return (
    <section className="mx-auto max-w-xl">
      <Link to="/products" className="font-semibold text-primary">
        Back to products
      </Link>

      <div className="mt-6 rounded-xl border border-border bg-surface p-6">
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-2xl font-bold text-heading">{product.name}</h1>

          <div className="flex gap-2">
            <Link
              to={`/products/${encodeURIComponent(product.id)}/edit`}
              className="rounded-lg border border-primary px-4 py-2 font-semibold text-primary hover:bg-primary hover:text-on-primary"
            >
              Edit
            </Link>

            <button
              type="button"
              onClick={handleDelete}
              disabled={isDeleting}
              className="rounded-lg border border-danger px-4 py-2 font-semibold text-danger hover:bg-danger hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
        {deleteError && (
          <p role="alert" className="mt-4 text-sm font-medium text-danger">
            {deleteError}
          </p>
        )}

        <dl className="mt-6 space-y-4">
          <div>
            <dt className="text-sm font-semibold text-muted">Price</dt>
            <dd className="mt-1 text-heading">${product.price.toFixed(2)}</dd>
          </div>

          <div>
            <dt className="text-sm font-semibold text-muted">Category</dt>
            <dd className="mt-1 text-heading">{product.category}</dd>
          </div>

          <div>
            <dt className="text-sm font-semibold text-muted">Stock</dt>
            <dd className="mt-1 text-heading">{product.stock}</dd>
          </div>
        </dl>
      </div>
    </section>
  );
}

export default ProductDetail;
