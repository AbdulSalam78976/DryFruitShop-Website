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

// Only active products with at least one active, in-stock-or-not grade --
// the storefront shows out-of-stock items too (greyed out), just not
// inactive/discontinued ones.
export async function listProducts(): Promise<Product[]> {
  requireConfigured();
  const { data, error } = await supabase
    .from("products")
    .select("*, grades:product_grades(*)")
    .eq("is_active", true)
    .order("name");
  if (error) throw error;
  return (data as Product[]).map((p) => ({ ...p, grades: p.grades.filter((g) => g.is_active) }));
}

export async function getProduct(id: string): Promise<Product | null> {
  requireConfigured();
  const { data, error } = await supabase
    .from("products")
    .select("*, grades:product_grades(*)")
    .eq("id", id)
    .eq("is_active", true)
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;
  const product = data as Product;
  return { ...product, grades: product.grades.filter((g) => g.is_active) };
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
