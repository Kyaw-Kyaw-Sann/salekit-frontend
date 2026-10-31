import { useEffect, useState } from "react";
import { getProducts } from "../../api/productsApi";
import type { Product } from "../../types";
import { Link } from "react-router-dom";

function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadProducts() {
      try {
        const productList = await getProducts();
        setProducts(productList);
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Failed to load products";

        setError(message);
      } finally {
        setIsLoading(false);
      }
    }

    loadProducts();
  }, []);

  if (isLoading) {
    return <p>Loading products...</p>;
  }

  if (error) {
    return <p role="alert">{error}</p>;
  }

  return (
    <section>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-heading">Products</h1>

        <Link
          to="/products/new"
          className="rounded-lg bg-primary px-4 py-2 font-semibold text-on-primary hover:bg-primary-hover"
        >
          Add product
        </Link>
      </div>

      {products.length === 0 ? (
        <p className="mt-6 text-body">No products found.</p>
      ) : (
        <ul className="mt-6 space-y-2">
          {products.map((product) => (
            <li
              key={product.id}
              className="rounded-lg border border-border bg-surface"
            >
              <Link
                to={`/products/${encodeURIComponent(product.id)}`}
                className="flex items-center justify-between p-4 transition hover:bg-background"
              >
                <span className="font-semibold text-heading">
                  {product.name}
                </span>

                <span className="text-body">${product.price.toFixed(2)}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default ProductList;
