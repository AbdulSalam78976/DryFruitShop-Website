import { isSupabaseConfigured, supabase } from "./supabase";
import type { Bundle, Category, Product, Settings } from "./types";

// Without real credentials, every one of these would otherwise attempt a
// network call to an unresolvable placeholder host and hang for several
// seconds before failing -- fail immediately instead, so a missing/wrong
// .env.local shows up fast and clearly rather than as a slow DNS timeout.
function requireConfigured() {
  if (!isSupabaseConfigured) {
    throw new Error("Supabase isn't configured -- see .env.local.example");
  }
}

export async function listCategories(): Promise<Category[]> {
  requireConfigured();
  const { data, error } = await supabase.from("categories").select("*").order("sort_order");
  if (error) throw error;
  return data;
}

// Products are usually assigned to a *subcategory* (e.g. "California
// Almonds"), not the major category ("Almonds") itself -- so when a product
// has no photo of its own, falling back to just its direct category's image
// misses photos set only on the major category. Walk up to the parent too.
async function resolveCategoryImages<T extends { category?: Product["category"] }>(items: T[]): Promise<T[]> {
  if (!items.some((i) => i.category && !i.category.image_url)) return items;
  const categories = await listCategories();
  const byId = new Map(categories.map((c) => [c.id, c]));
  return items.map((item) => {
    if (!item.category || item.category.image_url) return item;
    const parentId = byId.get(item.category.id)?.parent_id;
    const parentImage = parentId ? byId.get(parentId)?.image_url : null;
    return parentImage ? { ...item, category: { ...item.category, image_url: parentImage } } : item;
  });
}

// Only active products with at least one active, in-stock-or-not grade --
// the storefront shows out-of-stock items too (greyed out), just not
// inactive/discontinued ones.
export async function listProducts(): Promise<Product[]> {
  requireConfigured();
  const { data, error } = await supabase
    .from("products")
    .select("*, grades:product_grades(*), category:categories(id, name, image_url)")
    .eq("is_active", true)
    .order("name");
  if (error) throw error;
  const products = (data as Product[]).map((p) => ({ ...p, grades: p.grades.filter((g) => g.is_active) }));
  return resolveCategoryImages(products);
}

export async function getProduct(id: string): Promise<Product | null> {
  requireConfigured();
  const { data, error } = await supabase
    .from("products")
    .select("*, grades:product_grades(*), category:categories(id, name, image_url)")
    .eq("id", id)
    .eq("is_active", true)
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;
  const product = data as Product;
  const [resolved] = await resolveCategoryImages([{ ...product, grades: product.grades.filter((g) => g.is_active) }]);
  return resolved;
}

export async function listBundles(): Promise<Bundle[]> {
  requireConfigured();
  const { data, error } = await supabase.from("bundles").select("id, name, price, image_url").order("name");
  if (error) throw error;
  return data;
}

export async function getSettings(): Promise<Settings | null> {
  requireConfigured();
  const { data, error } = await supabase.from("settings").select("*").limit(1).maybeSingle();
  if (error) throw error;
  return data;
}
