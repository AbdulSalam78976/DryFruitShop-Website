import Image from "next/image";
import { notFound } from "next/navigation";
import { getProduct } from "@/lib/db";
import AddToCartPanel from "@/components/AddToCartPanel";

export const dynamic = "force-dynamic";

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getProduct(id).catch(() => null);
  if (!product || product.grades.length === 0) notFound();

  const imageUrl = product.grades[0]?.image_url || product.image_url;

  return (
    <div className="w-full bg-background">
      <div className="mx-auto max-w-[1280px] px-4 pt-28 pb-20 lg:px-12">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-16">
          <div className="space-y-6 lg:col-span-6">
            <div className="group relative aspect-square w-full overflow-hidden rounded-xl bg-surface-container-low shadow-md">
              {imageUrl ? (
                <Image src={imageUrl} alt={product.name} fill priority className="object-cover transition-transform duration-700 ease-out group-hover:scale-105" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-outline">
                  <span className="material-symbols-outlined text-6xl">nutrition</span>
                </div>
              )}
              <div className="absolute top-6 right-6 z-10 flex h-16 w-16 items-center justify-center rounded-full border border-secondary-fixed/20 bg-surface-container/90 shadow-lg backdrop-blur-md">
                <span className="material-symbols-outlined text-[32px] text-secondary-fixed">verified</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-center lg:col-span-6">
            <span className="mb-2 inline-block w-fit rounded-full bg-secondary-container px-3 py-1 text-xs tracking-widest text-on-secondary-container uppercase">
              Premium Harvest
            </span>
            <h1 className="font-serif text-4xl text-primary md:text-5xl">{product.name}</h1>
            {product.name_urdu && (
              <h2 dir="rtl" className="font-nastaliq mb-6 text-2xl text-on-surface-variant">
                {product.name_urdu}
              </h2>
            )}
            {product.description && <p className="mb-8 max-w-xl text-lg leading-relaxed text-on-surface-variant">{product.description}</p>}

            <AddToCartPanel product={product} />
          </div>
        </div>
      </div>
    </div>
  );
}
