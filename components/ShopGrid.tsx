"use client";

import Link from "next/link";
import { useState } from "react";
import type { Category, Product } from "@/lib/types";
import ProductCard from "./ProductCard";

type SoldBy = "all" | "gram" | "unit";

export default function ShopGrid({
  categories,
  products,
  initialCategory,
  initialSearch,
}: {
  categories: Category[];
  products: Product[];
  initialCategory?: string | null;
  initialSearch?: string;
}) {
  const [activeCategory, setActiveCategory] = useState<string | null>(initialCategory ?? null);
  const [search, setSearch] = useState(initialSearch ?? "");
  const [soldBy, setSoldBy] = useState<SoldBy>("all");

  const activeCategoryObj = categories.find((c) => c.id === activeCategory) ?? null;

  const byCategory = activeCategory ? products.filter((p) => p.category_id === activeCategory) : products;
  const bySoldBy =
    soldBy === "all" ? byCategory : byCategory.filter((p) => p.grades.some((g) => g.pricing_unit === soldBy));
  const q = search.trim().toLowerCase();
  const visible = q ? bySoldBy.filter((p) => p.name.toLowerCase().includes(q) || p.name_urdu?.includes(search.trim())) : bySoldBy;

  return (
    <div className="flex w-full flex-col gap-6 pb-4">
      <div className="text-[11.5px] text-ink/50">
        <Link href="/" className="hover:text-ink">
          Home
        </Link>{" "}
        <span className="opacity-40">/</span> <span className="text-ink">{activeCategoryObj?.name ?? "All Products"}</span>
      </div>

      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl sm:text-4xl">{activeCategoryObj?.name ?? "All Products"}</h1>
          {activeCategoryObj?.name_urdu && <span className="font-urdu block text-lg text-green-700">{activeCategoryObj.name_urdu}</span>}
        </div>
        <span className="text-xs text-ink/50">
          {visible.length} product{visible.length === 1 ? "" : "s"}
        </span>
      </div>

      <div className="grid gap-6 lg:grid-cols-[236px_1fr] lg:items-start">
        <aside className="flex flex-col gap-5 rounded-[22px] border border-ink/10 bg-white p-5">
          <div>
            <div className="relative">
              <span className="material-symbols-outlined absolute top-1/2 left-3 -translate-y-1/2 text-[18px] text-ink/40">search</span>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search…"
                className="w-full rounded-full border border-ink/12 bg-stone-50 py-2 pr-3 pl-9 text-[13px] focus:border-gold-500 focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          <div className="h-px bg-ink/10" />

          <div>
            <div className="mb-2.5 text-[10.5px] font-semibold tracking-[0.14em] text-ink/45 uppercase">Shelf</div>
            <div className="flex flex-col gap-2">
              <FilterRadio label="All" count={products.length} active={activeCategory === null} onClick={() => setActiveCategory(null)} />
              {categories.map((c) => (
                <FilterRadio
                  key={c.id}
                  label={c.name}
                  count={products.filter((p) => p.category_id === c.id).length}
                  active={activeCategory === c.id}
                  onClick={() => setActiveCategory(c.id)}
                />
              ))}
            </div>
          </div>

          <div className="h-px bg-ink/10" />

          <div>
            <div className="mb-2.5 text-[10.5px] font-semibold tracking-[0.14em] text-ink/45 uppercase">Sold by</div>
            <div className="flex rounded-full border border-ink/12 p-1 text-[12.5px] font-semibold">
              {(["all", "gram", "unit"] as SoldBy[]).map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setSoldBy(v)}
                  className={`flex-1 rounded-full py-1.5 transition ${soldBy === v ? "bg-green-deep text-cream" : "text-ink/60"}`}
                >
                  {v === "all" ? "All" : v === "gram" ? "Weight" : "Unit"}
                </button>
              ))}
            </div>
          </div>
        </aside>

        <div>
          {visible.length === 0 ? (
            <div className="flex flex-col items-center gap-3 rounded-[26px] border border-dashed border-ink/20 bg-white p-14 text-center">
              <span className="material-symbols-outlined text-3xl text-ink/30">search_off</span>
              <h3 className="text-xl">No matching items</h3>
              <p className="max-w-sm text-xs text-ink/50">Try a different search term or category.</p>
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setActiveCategory(null);
                  setSoldBy("all");
                }}
                className="mt-2 rounded-full bg-green-deep px-5 py-2.5 text-xs font-semibold text-gold-200"
              >
                Reset filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
              {visible.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function FilterRadio({ label, count, active, onClick }: { label: string; count: number; active: boolean; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="flex items-center gap-2.5 text-left text-[13.5px]">
      <span
        className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 ${
          active ? "border-gold-500" : "border-ink/25"
        }`}
      >
        {active && <span className="h-2 w-2 rounded-full bg-gold-500" />}
      </span>
      <span className="flex flex-1 justify-between">
        <span className={active ? "font-semibold text-ink" : "text-ink/75"}>{label}</span>
        <span className="font-mono-num text-ink/40">{count}</span>
      </span>
    </button>
  );
}
