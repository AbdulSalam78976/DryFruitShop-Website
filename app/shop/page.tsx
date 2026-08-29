import { listCategories, listProducts } from "@/lib/db";
import ShopGrid from "@/components/ShopGrid";

export const dynamic = "force-dynamic";

export default async function ShopPage({ searchParams }: { searchParams: Promise<{ category?: string; search?: string }> }) {
  const [{ category, search }, categories, products] = await Promise.all([searchParams, listCategories(), listProducts()]);

  return (
    <div className="w-full bg-cream pb-16">
      <div className="mx-auto max-w-[1216px] px-4 pt-6 sm:px-8">
        <ShopGrid categories={categories} products={products} initialCategory={category ?? null} initialSearch={search ?? ""} />
      </div>
    </div>
  );
}
