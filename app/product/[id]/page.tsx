import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProduct, listProducts } from "@/lib/db";
import { resolveImageUrl } from "@/lib/image";
import { formatCurrency, pricePerDisplayUnit } from "@/lib/format";
import AddToCartPanel from "@/components/AddToCartPanel";

export const dynamic = "force-dynamic";

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getProduct(id).catch(() => null);
  if (!product) notFound();

  const allProducts = await listProducts().catch(() => []);
  const related = allProducts.filter((p) => p.id !== product.id && p.category_id === product.category_id).slice(0, 4);

  const imageUrl = resolveImageUrl(product, product.grades[0]?.image_url);

  return (
    <div className="mx-auto w-full max-w-[1216px] px-4 py-8 sm:px-8">
      <div className="mb-4 text-[11.5px] text-ink/50">
        <Link href="/" className="hover:text-ink">
          Home
        </Link>{" "}
        <span className="opacity-40">/</span>{" "}
        {product.category && (
          <>
            <Link href={`/shop?category=${product.category.id}`} className="hover:text-ink">
              {product.category.name}
            </Link>{" "}
            <span className="opacity-40">/</span>{" "}
          </>
        )}
        <span className="text-ink">{product.name}</span>
      </div>

      <div className="grid gap-9 lg:grid-cols-[1fr_480px] lg:items-start">
        <div>
          <div className="relative aspect-4/3 overflow-hidden rounded-[26px] border border-ink/10 bg-stone-100">
            {imageUrl ? (
              <Image src={imageUrl} alt={product.name} fill className="object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-stone-400">
                <span className="material-symbols-outlined text-5xl">nutrition</span>
              </div>
            )}
          </div>

          {product.description && (
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div>
                <div className="mb-1 font-heading text-base">About this product</div>
                <p className="text-[12.5px] leading-relaxed text-ink/60">{product.description}</p>
              </div>
              <div>
                <div className="mb-1 font-heading text-base">Packing</div>
                <p className="text-[12.5px] leading-relaxed text-ink/60">
                  Weighed after you order, sealed, weight printed on the seal.
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-4">
          <div>
            <span className="text-[10.5px] font-semibold tracking-[0.15em] text-gold-600 uppercase">
              {product.category?.name}
              {product.grades.length > 1 ? ` · ${product.grades.length} varieties` : ""}
            </span>
            <h1 className="mt-1.5 text-4xl">{product.name}</h1>
            {product.name_urdu && <span className="font-urdu block text-xl text-green-700">{product.name_urdu}</span>}
          </div>

          <AddToCartPanel product={product} />
        </div>
      </div>

      {related.length > 0 && (
        <div className="mt-12">
          <h2 className="mb-4 text-2xl">Often bought alongside</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {related.map((p) => {
              const g = p.grades[0];
              const img = resolveImageUrl(p, g?.image_url);
              return (
                <Link key={p.id} href={`/product/${p.id}`} className="flex items-center gap-3 rounded-[22px] border border-ink/10 bg-white p-3">
                  <span className="relative h-[52px] w-[52px] shrink-0 overflow-hidden rounded-2xl bg-stone-100">
                    {img && <Image src={img} alt="" fill className="object-cover" />}
                  </span>
                  <span className="flex-1">
                    <span className="block truncate font-heading text-[15px]">{p.name}</span>
                    {g && (
                      <span className="font-mono-num block text-[13px] font-semibold">
                        {formatCurrency(pricePerDisplayUnit(g.price, g.display_unit))}
                        <span className="text-[10.5px] font-normal text-ink/50">/{g.display_unit}</span>
                      </span>
                    )}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
