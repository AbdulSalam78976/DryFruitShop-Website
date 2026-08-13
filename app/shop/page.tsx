import { listCategories, listProducts } from "@/lib/db";
import ShopGrid from "@/components/ShopGrid";

export const dynamic = "force-dynamic";

export default async function ShopPage() {
  const [categories, products] = await Promise.all([listCategories(), listProducts()]);

  return (
    <div className="relative w-full overflow-hidden bg-background pt-28 pb-32">
      <div className="pointer-events-none absolute top-0 right-0 h-96 w-96 -translate-y-1/2 translate-x-1/2 rounded-full bg-primary-fixed-dim/20 blur-3xl" />

      <div className="relative z-10 mx-auto mb-16 max-w-[1280px] px-4 lg:px-12">
        <div className="flex items-center justify-between border-b-2 border-outline-variant/30 pb-4">
          <h1 className="font-serif text-4xl text-primary sm:text-5xl">Discover the Harvest</h1>
        </div>
        <ShopGrid categories={categories} products={products} />
      </div>
    </div>
  );
}
