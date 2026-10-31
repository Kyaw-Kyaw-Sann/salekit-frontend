import { apiRequest } from "./apiClient"
import type { Product, ProductFormData } from "../types"

export function getProducts() {
  return apiRequest<Product[]>("/products")
}

export function createProduct(productData: ProductFormData) {
  return apiRequest<Product>("/products", {
    method: "POST",
    body: JSON.stringify(productData),
  })
}

export function getProductById(productId: string) {
  return apiRequest<Product>(
    `/products/${encodeURIComponent(productId)}`,
  )
}

export function updateProduct(
  productId: string,
  productData: ProductFormData,
) {
  return apiRequest<Product>(
    `/products/${encodeURIComponent(productId)}`,
    {
      method: "PUT",
      body: JSON.stringify(productData),
    },
  )
}

export function deleteProduct(productId: string) {
  return apiRequest<{ message: string }>(
    `/products/${encodeURIComponent(productId)}`,
    {
      method: "DELETE",
    },
  )
}