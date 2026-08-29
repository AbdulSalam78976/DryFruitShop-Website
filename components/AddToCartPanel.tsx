"use client";

import { useState } from "react";
import type { Product, ProductGrade } from "@/lib/types";
import { useCart } from "@/lib/cart-context";
import { formatCurrency, formatGrams, pricePerDisplayUnit } from "@/lib/format";
import { resolveImageUrl } from "@/lib/image";

const QUICK_WEIGHTS_G = [250, 500, 1000, 2000];
const BUDGETS = [500, 1000, 2000];

export default function AddToCartPanel({ product }: { product: Product }) {
  const { addLine } = useCart();
  const [gradeId, setGradeId] = useState(product.grades[0].id);
  const grade = product.grades.find((g) => g.id === gradeId) as ProductGrade;
  const isUnit = grade.pricing_unit === "unit";
  const inStock = true; // stock levels aren't exposed to the storefront yet

  const [mode, setMode] = useState<"weight" | "budget">("weight");
  const [grams, setGrams] = useState(500);
  const [budget, setBudget] = useState<number | null>(null);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const quantity = isUnit ? qty : mode === "budget" && budget ? Math.round(budget / grade.price) : grams;
  const lineTotal = quantity * grade.price;

  const handleAdd = () => {
    addLine({
      gradeId: grade.id,
      productName: product.name,
      gradeName: grade.name,
      imageUrl: resolveImageUrl(product, grade.image_url),
      pricePerBaseUnit: grade.price,
      pricingUnit: grade.pricing_unit,
      displayUnit: grade.display_unit,
      quantity,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <div className="flex flex-col gap-5 rounded-[26px] border border-ink/10 bg-white p-6 shadow-sm">
      {product.grades.length > 1 && (
        <div>
          <div className="mb-2.5 text-[10.5px] font-semibold tracking-[0.14em] text-ink/45 uppercase">Variety</div>
          <div className="grid grid-cols-2 gap-2">
            {product.grades.map((g) => {
              const active = g.id === gradeId;
              return (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => setGradeId(g.id)}
                  className={`flex items-center gap-2.5 rounded-2xl px-3.5 py-2.5 text-left transition ${
                    active ? "bg-green-deep text-cream" : "border border-ink/12 bg-stone-50"
                  }`}
                >
                  <span
                    className={`h-3.5 w-3.5 shrink-0 rounded-full border-2 ${active ? "border-gold-400 bg-gold-400" : "border-ink/25"}`}
                  />
                  <span className="flex-1">
                    <span className="block text-[13.5px] font-semibold">{g.name || product.name}</span>
                  </span>
                  <span className={`font-mono-num text-[12.5px] ${active ? "text-gold-200" : "text-ink/55"}`}>
                    {formatCurrency(pricePerDisplayUnit(g.price, g.display_unit))}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className="h-px bg-ink/10" />

      {isUnit ? (
        <div>
          <div className="mb-2.5 text-[10.5px] font-semibold tracking-[0.14em] text-ink/45 uppercase">Quantity</div>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-ink/15"
            >
              <span className="material-symbols-outlined text-[18px]">remove</span>
            </button>
            <span className="font-mono-num w-8 text-center text-base font-semibold">{qty}</span>
            <button
              type="button"
              onClick={() => setQty((q) => q + 1)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-ink/15"
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
            </button>
          </div>
        </div>
      ) : (
        <div>
          <div className="mb-2.5 flex items-baseline justify-between">
            <div className="text-[10.5px] font-semibold tracking-[0.14em] text-ink/45 uppercase">Weight</div>
            <span className="font-mono-num text-[11.5px] text-ink/50">
              {formatCurrency(grade.price * 1000)}/kg · {formatCurrency(grade.price)}/g
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {QUICK_WEIGHTS_G.map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => {
                  setMode("weight");
                  setGrams(g);
                }}
                className={`font-mono-num rounded-full px-4 py-2 text-[13px] ${
                  mode === "weight" && grams === g ? "bg-gold-500 font-semibold text-green-deep" : "border border-ink/12 bg-stone-50"
                }`}
              >
                {formatGrams(g)}
              </button>
            ))}
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-2 rounded-2xl bg-green-100 px-3.5 py-2.5">
            <span className="text-[11px] font-semibold tracking-[0.08em] text-green-700 uppercase">Or by budget</span>
            {BUDGETS.map((b) => (
              <button
                key={b}
                type="button"
                onClick={() => {
                  setMode("budget");
                  setBudget(b);
                }}
                className={`font-mono-num rounded-full px-3 py-1.5 text-[12.5px] ${
                  mode === "budget" && budget === b ? "bg-green-deep text-cream" : "bg-white"
                }`}
              >
                {formatCurrency(b)}
              </button>
            ))}
            {mode === "budget" && budget && (
              <span className="ml-auto text-[11px] text-green-700">≈ {formatGrams(quantity)} at {formatCurrency(budget)}</span>
            )}
          </div>
        </div>
      )}

      <div className="h-px bg-ink/10" />

      <div className="flex items-end justify-between">
        <div>
          <div className="mb-1 text-[10.5px] font-semibold tracking-[0.14em] text-ink/45 uppercase">Line total</div>
          <div className="flex items-baseline gap-2">
            <span className="font-mono-num text-3xl font-semibold">{formatCurrency(lineTotal)}</span>
            <span className="text-[13px] text-ink/55">
              {grade.name ? `${grade.name} · ` : ""}
              {isUnit ? `${quantity} ${grade.display_unit}${quantity === 1 ? "" : "s"}` : formatGrams(quantity)}
            </span>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={handleAdd}
        disabled={!inStock}
        className="flex w-full items-center justify-center gap-2.5 rounded-2xl bg-gold-500 py-3.5 text-[13.5px] font-semibold text-green-deep transition hover:bg-gold-600 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <span className="material-symbols-outlined text-[19px]">shopping_bag</span>
        {added ? "Added to cart" : "Add to cart"}
      </button>
      <div className="-mt-2 flex flex-wrap gap-3 text-[11.5px] text-ink/55">
        <span>Weighed &amp; sealed today</span>
        <span>·</span>
        <span>Delivery fee confirmed on WhatsApp</span>
        <span>·</span>
        <span>Pickup free</span>
      </div>
    </div>
  );
}
