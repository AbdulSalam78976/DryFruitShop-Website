import Image from "next/image";
import Link from "next/link";
import { listBundles, listCategories, listProducts } from "@/lib/db";
import { formatCurrency, pricePerDisplayUnit } from "@/lib/format";
import { resolveImageUrl } from "@/lib/image";
import ProductCard from "@/components/ProductCard";

export const dynamic = "force-dynamic";

const CATEGORY_BLURBS: Record<string, string> = {
  "Dry Fruit": "Almonds, walnuts, chilgoza, dates and more. Sold from 100g, cut and sealed after you order.",
  Spices: "Whole or ground while you wait. Blends mixed to the same recipe for years.",
  Pansar: "The drawers people come specifically for — herbs, husks, gums and honey.",
};

export default async function Home() {
  const [products, categories, bundles] = await Promise.all([
    listProducts().catch(() => []),
    listCategories().catch(() => []),
    listBundles().catch(() => []),
  ]);

  const hotThisWeek = products.slice(0, 5);
  const featuredProduct = products.find((p) => p.grades.length > 0);
  const featuredGrade = featuredProduct?.grades[0];
  const pansarProducts = products.filter((p) => p.category?.name === "Pansar").slice(0, 4);

  return (
    <div className="flex w-full flex-col bg-cream">
      {/* Hero */}
      <section className="relative overflow-hidden bg-green-deep px-6 py-12 sm:px-8 sm:py-14">
        <span className="pointer-events-none absolute -top-32 -right-36 h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle_at_42%_42%,rgba(201,144,31,.3),rgba(201,144,31,0)_68%)]" />
        <span className="pointer-events-none absolute -bottom-36 -left-24 h-[340px] w-[340px] rounded-full bg-[radial-gradient(circle_at_50%_40%,rgba(63,130,102,.28),rgba(63,130,102,0)_70%)]" />
        <div className="relative mx-auto grid max-w-[1216px] gap-10 lg:grid-cols-[1fr_420px] lg:items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-gold-400/45 px-3.5 py-1.5 text-[10.5px] font-semibold tracking-[0.14em] text-gold-300 uppercase">
              <span className="h-1.5 w-1.5 rounded-full bg-gold-400" />A counter shop on Main PWD Road, since 1998
            </span>
            <h1 className="mt-4 max-w-xl text-4xl leading-[1.08] text-cream sm:text-5xl">
              Nothing pre-packed.
              <br />
              Everything weighed the day you order.
            </h1>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-stone-100/80">
              Sixty-odd lines across three shelves, every grade priced on its own. Order from 100g up, or tell us a
              budget and we&rsquo;ll fill the bag.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link href="/shop" className="rounded-full bg-gold-500 px-6 py-3 text-[13.5px] font-semibold text-green-deep hover:bg-gold-600">
                Browse the shelves
              </Link>
              <span className="text-[11px] tracking-[0.1em] text-gold-300/70 uppercase">Most asked for</span>
              {["Ajwa dates", "Chilgoza", "Ispaghol", "Saffron"].map((tag) => (
                <Link
                  key={tag}
                  href={`/shop?search=${encodeURIComponent(tag)}`}
                  className="rounded-full border border-cream/20 bg-cream/10 px-3 py-1.5 text-xs text-gold-100"
                >
                  {tag}
                </Link>
              ))}
            </div>
          </div>

          <div className="relative hidden h-[360px] lg:block">
            <Image
              src="/hero-valley.jpg"
              alt=""
              width={340}
              height={340}
              className="absolute right-0 top-0 h-[340px] w-[340px] rounded-[50%_50%_46%_54%/52%_48%_52%_48%] object-cover shadow-2xl"
            />
            {featuredProduct && featuredGrade && (
              <div className="absolute right-0 bottom-6 rounded-[22px] bg-cream px-4 py-3 shadow-xl">
                <div className="text-[9.5px] tracking-[0.14em] text-ink/45 uppercase">Today at the counter</div>
                <div className="font-mono-num text-lg font-semibold">
                  {formatCurrency(pricePerDisplayUnit(featuredGrade.price, featuredGrade.display_unit))}
                  <span className="text-[11px] font-normal text-ink/50">/{featuredGrade.display_unit}</span>
                </div>
                <div className="text-[11.5px] font-semibold text-green-600">{featuredProduct.name}</div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Shop by category */}
      <section className="px-6 py-12 sm:px-8">
        <div className="mx-auto max-w-[1216px]">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
            <div className="max-w-xl">
              <span className="text-[10.5px] font-semibold tracking-[0.16em] text-gold-600 uppercase">Three shelves</span>
              <h2 className="mt-1 text-3xl sm:text-4xl">Shop by category</h2>
              <p className="mt-2 text-sm text-ink/60">
                The same three shelves as the shop. Dry fruit by weight, spices ground to order, and the pansar
                drawers behind the counter.
              </p>
            </div>
            <Link href="/shop" className="rounded-full border border-ink/15 px-4 py-2 text-xs font-semibold hover:bg-white">
              Browse everything
            </Link>
          </div>

          <div className="grid gap-5 sm:grid-cols-3">
            {categories.map((c) => {
              const count = products.filter((p) => p.category_id === c.id).length;
              return (
                <Link
                  key={c.id}
                  href={`/shop?category=${c.id}`}
                  className="flex flex-col overflow-hidden rounded-[26px] border border-ink/10 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="relative aspect-[16/11] bg-stone-100">
                    {c.image_url ? (
                      <Image src={c.image_url} alt="" fill className="object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-stone-400">
                        <span className="material-symbols-outlined text-4xl">eco</span>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col gap-2.5 p-5">
                    <div className="flex items-baseline justify-between gap-2">
                      <div>
                        <div className="font-heading text-2xl leading-tight">{c.name}</div>
                        {c.name_urdu && <div className="font-urdu text-base text-green-700">{c.name_urdu}</div>}
                      </div>
                      <span className="font-mono-num text-[11px] text-ink/45">{count} products</span>
                    </div>
                    <p className="text-[13px] leading-relaxed text-ink/60">{CATEGORY_BLURBS[c.name] ?? ""}</p>
                    <span className="mt-auto flex items-center gap-1.5 pt-1 text-[13px] font-semibold text-gold-600">
                      Open shelf
                      <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Just landed */}
      {featuredProduct && featuredGrade && (
        <section className="px-6 pb-10 sm:px-8">
          <div className="mx-auto grid max-w-[1216px] overflow-hidden rounded-[30px] bg-green-700 sm:grid-cols-[1fr_1.05fr]">
            <div className="p-8 sm:p-10">
              <span className="inline-block rounded-full bg-gold-400/15 px-3.5 py-1.5 text-[10.5px] font-semibold tracking-[0.14em] text-gold-300 uppercase">
                Featured this week
              </span>
              <h2 className="mt-4 max-w-sm text-3xl text-cream">{featuredProduct.name}, weighed fresh to order.</h2>
              {featuredProduct.name_urdu && <p className="font-urdu mt-2 text-base text-gold-300">{featuredProduct.name_urdu}</p>}
              <p className="mt-3 max-w-sm text-sm leading-relaxed text-stone-100/75">
                {featuredProduct.description || "Sourced with care and weighed the moment your order lands — not off a pre-packed shelf."}
              </p>
              <div className="mt-5">
                <div className="text-[10px] tracking-[0.14em] text-gold-300/70 uppercase">Counter price today</div>
                <div className="font-mono-num text-2xl font-semibold text-cream">
                  {formatCurrency(pricePerDisplayUnit(featuredGrade.price, featuredGrade.display_unit))}
                  <span className="text-xs font-normal text-stone-100/60">/{featuredGrade.display_unit}</span>
                </div>
              </div>
              <div className="mt-5 flex gap-2.5">
                <Link href={`/product/${featuredProduct.id}`} className="rounded-full bg-gold-500 px-5 py-3 text-[13.5px] font-semibold text-green-deep hover:bg-gold-600">
                  Order now
                </Link>
                <Link href="/shop" className="rounded-full border border-cream/30 px-5 py-3 text-[13.5px] text-gold-100">
                  Other arrivals
                </Link>
              </div>
            </div>
            <div className="relative min-h-[260px]">
              <Image src="/hero-valley.jpg" alt="" fill className="object-cover" />
              <span className="absolute inset-0 bg-[linear-gradient(90deg,#0d4a35_2%,rgba(13,74,53,.45)_40%,rgba(13,74,53,.1))]" />
            </div>
          </div>
        </section>
      )}

      {/* Hot this week */}
      {hotThisWeek.length > 0 && (
        <section className="px-6 pb-10 sm:px-8">
          <div className="mx-auto max-w-[1216px]">
            <div className="mb-5 flex items-end justify-between">
              <div>
                <span className="text-[10.5px] font-semibold tracking-[0.16em] text-gold-600 uppercase">Moving fastest</span>
                <h2 className="mt-1 text-3xl">Hot this week</h2>
              </div>
              <Link href="/shop" className="rounded-full border border-ink/15 px-4 py-2 text-xs font-semibold hover:bg-white">
                See all products
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
              {hotThisWeek.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Budget mode */}
      <section className="px-6 pb-10 sm:px-8">
        <div className="mx-auto grid max-w-[1216px] items-center gap-8 rounded-[30px] bg-green-100 p-8 sm:grid-cols-[1.25fr_1fr]">
          <div>
            <span className="text-[10.5px] font-semibold tracking-[0.16em] text-green-600 uppercase">Budget mode</span>
            <h3 className="mt-1.5 text-2xl sm:text-3xl">Tell us a number, we&rsquo;ll fill the bag.</h3>
            <p className="mt-2 max-w-md text-sm leading-relaxed text-ink/65">
              The way the counter already works. Pick an amount and a variety on any product page — we weigh out
              exactly that much and print the weight on the seal.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {["Rs 500", "Rs 1,000", "Rs 2,000", "Rs 5,000"].map((amount) => (
              <span key={amount} className="font-mono-num rounded-full border border-green-700/20 bg-white px-4.5 py-3 text-sm">
                {amount}
              </span>
            ))}
            <Link href="/shop" className="rounded-full border border-dashed border-green-700/35 px-4.5 py-3 text-[13px] text-green-700">
              Custom…
            </Link>
          </div>
        </div>
      </section>

      {/* Gift trays & bulk */}
      <section className="px-6 pb-10 sm:px-8">
        <div className="mx-auto max-w-[1216px]">
          <div className="mb-5 max-w-lg">
            <span className="text-[10.5px] font-semibold tracking-[0.16em] text-gold-600 uppercase">Made up at the shop</span>
            <h2 className="mt-1 text-3xl">Gift trays &amp; bulk</h2>
            <p className="mt-2 text-sm text-ink/60">Assembled the morning they go out. Swap anything inside — just leave a note at checkout.</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {bundles.slice(0, 2).map((b) => (
              <article key={b.id} className="flex gap-4 rounded-[26px] border border-ink/10 bg-white p-4">
                <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl bg-stone-100">
                  {b.image_url ? (
                    <Image src={b.image_url} alt="" fill className="object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-stone-400">
                      <span className="material-symbols-outlined text-2xl">redeem</span>
                    </div>
                  )}
                </div>
                <div className="flex flex-1 flex-col gap-1">
                  <div className="font-heading text-lg leading-tight">{b.name}</div>
                  <span className="mt-auto flex items-center justify-between pt-1">
                    <span className="font-mono-num text-base font-semibold">{formatCurrency(b.price)}</span>
                    <span className="text-xs font-semibold text-gold-600">View</span>
                  </span>
                </div>
              </article>
            ))}
            <article className="flex gap-4 rounded-[26px] border border-gold-400/30 bg-gold-100 p-4">
              <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl bg-white">
                <span className="material-symbols-outlined text-3xl text-gold-600">inventory_2</span>
              </div>
              <div className="flex flex-1 flex-col gap-1">
                <span className="w-fit rounded-full bg-white px-2.5 py-0.5 text-[10.5px] font-semibold text-gold-700">5kg and up</span>
                <div className="font-heading text-lg leading-tight">Bulk &amp; wholesale</div>
                <p className="text-xs leading-snug text-gold-800/75">Offices, hotels and resellers. Ask for rates.</p>
                <span className="mt-auto flex items-center justify-between pt-1 text-xs font-semibold text-gold-700">
                  Quoted per line <span>Ask for rates</span>
                </span>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* Pansar corner */}
      {pansarProducts.length > 0 && (
        <section className="relative overflow-hidden bg-green-deep px-6 py-11 sm:px-8">
          <span className="pointer-events-none absolute -top-24 -left-28 h-[300px] w-[300px] rounded-full bg-[radial-gradient(circle_at_50%_45%,rgba(63,130,102,.3),rgba(63,130,102,0)_70%)]" />
          <div className="relative mx-auto grid max-w-[1216px] gap-9 lg:grid-cols-[1fr_1.3fr] lg:items-center">
            <div>
              <span className="text-[10.5px] font-semibold tracking-[0.16em] text-gold-500 uppercase">The pansar corner</span>
              <h2 className="mt-3 text-3xl text-cream">Where regulars ask by name.</h2>
              <p className="mt-3 max-w-xs text-sm leading-relaxed text-stone-100/75">
                The drawers people come specifically for — asked for by their Urdu names, weighed on the small scale.
              </p>
              <Link href={`/shop?category=${pansarProducts[0]?.category_id ?? ""}`} className="mt-4 inline-block rounded-full border border-cream/30 px-5 py-3 text-[13.5px] text-gold-100">
                All Pansar lines
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {pansarProducts.map((p) => {
                const g = p.grades[0];
                return (
                  <Link
                    key={p.id}
                    href={`/product/${p.id}`}
                    className="flex items-center gap-3.5 rounded-[22px] border border-cream/15 bg-cream/5 px-4 py-3.5"
                  >
                    <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full bg-cream/10">
                      {resolveImageUrl(p, g?.image_url) && <Image src={resolveImageUrl(p, g?.image_url)!} alt="" fill className="object-cover" />}
                    </span>
                    <span className="flex-1">
                      <span className="block font-heading text-base text-cream">{p.name}</span>
                      {p.name_urdu && <span className="font-urdu block text-[13px] text-gold-400">{p.name_urdu}</span>}
                    </span>
                    {g && (
                      <span className="font-mono-num text-[13px] text-gold-100">
                        {formatCurrency(pricePerDisplayUnit(g.price, g.display_unit))}
                        <span className="text-[10.5px] text-stone-100/55">/{g.display_unit}</span>
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* How ordering works + why price moves */}
      <section className="px-6 py-11 sm:px-8">
        <div className="mx-auto grid max-w-[1216px] items-start gap-9 lg:grid-cols-[1fr_340px]">
          <div>
            <span className="text-[10.5px] font-semibold tracking-[0.16em] text-gold-600 uppercase">Three steps</span>
            <h2 className="mt-1 mb-5 text-2xl sm:text-3xl">How ordering works</h2>
            <div className="grid gap-5 sm:grid-cols-3">
              {[
                { n: 1, title: "Order online", body: "Pick variety and weight. Cash on delivery, Easypaisa or JazzCash. No account needed." },
                { n: 2, title: "Weighed & sealed", body: "Cut, weighed and sealed after your order lands — not off a pre-packed shelf." },
                { n: 3, title: "Pickup or delivery", body: "Collect at the shop, or same-day rider across Islamabad and Rawalpindi." },
              ].map((step) => (
                <div key={step.n} className="flex flex-col gap-2.5">
                  <span className="font-mono-num flex h-11 w-11 items-center justify-center rounded-full border border-gold-400/40 bg-gold-100 text-[15px] font-semibold text-gold-700">
                    {step.n}
                  </span>
                  <div>
                    <div className="font-heading text-lg">{step.title}</div>
                    <p className="mt-1 text-[12.5px] leading-relaxed text-ink/60">{step.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <aside className="rounded-[28px] border border-ink/10 bg-white p-5">
            <div className="mb-2.5 flex items-center gap-2.5">
              <span className="material-symbols-outlined text-gold-600">bar_chart</span>
              <span className="font-heading text-lg">Why the price moves</span>
            </div>
            <p className="text-[12.5px] leading-relaxed text-ink/60">
              Dry fruit is a market good. Rates shift with the crop, the dollar and the season — so the site carries
              today&rsquo;s counter price, the same one the shop is quoting. No fake &ldquo;was Rs 14,000&rdquo;
              strikethroughs.
            </p>
          </aside>
        </div>
      </section>
    </div>
  );
}
