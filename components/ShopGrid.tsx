"use client";

import { useState } from "react";
import type { Category, Product } from "@/lib/types";
import ProductCard from "./ProductCard";

export default function ShopGrid({ categories, products }: { categories: Category[]; products: Product[] }) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeSubcategory, setActiveSubcategory] = useState<string | null>(null);

  const topLevel = categories.filter((c) => !c.parent_id);
  const subcategories = activeCategory ? categories.filter((c) => c.parent_id === activeCategory) : [];

  const visible = activeSubcategory
    ? products.filter((p) => p.category_id === activeSubcategory)
    : activeCategory
      ? products.filter(
          (p) => p.category_id === activeCategory || subcategories.some((s) => s.id === p.category_id)
        )
      : products;

  return (
    <>
      {/* Category nav -- Nastaliq name over the English label, like a "خشک میوہ / Dry Fruits" tab */}
      <nav className="hide-scrollbar flex flex-nowrap gap-8 overflow-x-auto pt-8 pb-4 lg:gap-12 lg:overflow-visible">
        <CategoryTab label="All" active={activeCategory === null} onClick={() => { setActiveCategory(null); setActiveSubcategory(null); }} />
        {topLevel.map((c) => (
          <CategoryTab
            key={c.id}
            label={c.name}
            labelUrdu={c.name_urdu}
            active={activeCategory === c.id}
            onClick={() => { setActiveCategory(c.id); setActiveSubcategory(null); }}
          />
        ))}
      </nav>

      <div className="grid w-full grid-cols-1 gap-6 lg:grid-cols-4">
        <aside className="hidden h-fit flex-col gap-8 lg:sticky lg:top-28 lg:col-span-1 lg:flex">
          {subcategories.length > 0 && (
            <div className="space-y-4">
              <h3 className="relative inline-block font-serif text-xl text-primary">
                Subcategory
                <div className="absolute -bottom-2 left-0 h-0.5 w-8 bg-secondary-fixed" />
              </h3>
              <div className="flex flex-col gap-3 pt-2">
                <FilterCheckbox label="All" checked={activeSubcategory === null} onChange={() => setActiveSubcategory(null)} />
                {subcategories.map((s) => (
                  <FilterCheckbox key={s.id} label={s.name} checked={activeSubcategory === s.id} onChange={() => setActiveSubcategory(s.id)} />
                ))}
              </div>
            </div>
          )}

          <div className="group relative overflow-hidden rounded-xl bg-surface-container-low p-6 transition-shadow hover:shadow-lg">
            <h4 className="relative z-10 mb-2 font-serif text-xl text-primary">Artisanal Purity</h4>
            <p className="relative z-10 mb-4 text-sm text-on-surface-variant">
              Every product is sourced directly from heritage farmers, ensuring organic integrity.
            </p>
          </div>
        </aside>

        <div className="col-span-1 lg:col-span-3">
          {visible.length === 0 ? (
            <p className="mt-16 text-center text-on-surface-variant">No products in this category yet.</p>
          ) : (
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 xl:grid-cols-3">
              {visible.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function CategoryTab({ label, labelUrdu, active, onClick }: { label: string; labelUrdu?: string | null; active: boolean; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className={`group relative flex min-w-max flex-col items-center gap-2 transition-opacity ${active ? "" : "opacity-60 hover:opacity-100"}`}>
      {labelUrdu && <span className={`font-nastaliq text-2xl transition-colors ${active ? "text-primary" : "text-primary"}`}>{labelUrdu}</span>}
      <span className={`text-xs font-semibold tracking-widest uppercase transition-colors ${active ? "text-primary" : "text-on-surface"}`}>{label}</span>
      {active && <div className="absolute -bottom-3 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-secondary-fixed" />}
    </button>
  );
}

function FilterCheckbox({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) {
  return (
    <button type="button" onClick={onChange} className="group flex cursor-pointer items-center gap-3 text-left">
      <div
        className={`flex h-5 w-5 items-center justify-center rounded transition-colors ${
          checked ? "bg-primary-container/20" : "border border-outline-variant group-hover:border-primary"
        }`}
      >
        {checked && <span className="material-symbols-outlined icon-fill text-[16px] text-primary">check</span>}
      </div>
      <span className="text-sm text-on-surface transition-colors group-hover:text-primary">{label}</span>
    </button>
  );
}
