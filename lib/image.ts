import type { Product } from "./types";

// Fallback chain for any product/grade image: the grade's own photo, then
// the product's own photo, then its category's photo -- only falling all
// the way through to a generic icon (rendered by the caller) if none exist.
export function resolveImageUrl(product: Pick<Product, "image_url" | "category">, gradeImageUrl?: string | null) {
  return gradeImageUrl || product.image_url || product.category?.image_url || null;
}
