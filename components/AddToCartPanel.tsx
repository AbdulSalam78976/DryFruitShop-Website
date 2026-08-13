"use client";

import { useState } from "react";
import type { Product, ProductGrade } from "@/lib/types";
import { useCart } from "@/lib/cart-context";
import { formatCurrency, formatGrams } from "@/lib/format";

const QUICK_WEIGHTS_G = [250, 500, 1000, 2000];

export default function AddToCartPanel({ product }: { product: Product }) {
  const { addLine } = useCart();
  const [gradeId, setGradeId] = useState(product.grades[0].id);
  const grade = product.grades.find((g) => g.id === gradeId) as ProductGrade;

  const isUnit = grade.pricing_unit === "unit";
  const [grams, setGrams] = useState(1000);
  const [customKg, setCustomKg] = useState("");
  const [qty, setQty] = useState(1);

  const quantity = isUnit ? qty : grams;
  const lineTotal = quantity * grade.price;

  const pickWeight = (g: number) => {
    setCustomKg("");
    setGrams(g);
  };

  const handleAdd = () => {
    // Opening the cart drawer (see cart-context's addLine) is the feedback
    // that this worked -- no separate confirmation needed here.
    addLine({
      gradeId: grade.id,
      productName: product.name,
      gradeName: grade.name,
      imageUrl: grade.image_url || product.image_url,
      pricePerBaseUnit: grade.price,
      pricingUnit: grade.pricing_unit,
      displayUnit: grade.display_unit,
      quantity,
    });
  };

  return (
    <div>
      {product.grades.length > 1 && (
        <div className="mb-8">
          <h3 className="mb-4 text-sm font-semibold text-on-surface">Variant</h3>
          <div className="flex flex-wrap gap-3">
            {product.grades.map((g) => (
              <button
                key={g.id}
                type="button"
                onClick={() => setGradeId(g.id)}
                className={`rounded-full px-6 py-3 text-sm font-semibold transition-all duration-300 ${
                  g.id === gradeId ? "bg-primary text-secondary-fixed shadow-md" : "border border-primary text-primary hover:bg-surface-container-low"
                }`}
              >
                {g.name || product.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Dynamic pricing */}
      <div className="mb-8 flex items-baseline gap-4">
        <span className="font-serif text-3xl text-primary">{formatCurrency(lineTotal)}</span>
        <span className="text-xs tracking-wide text-on-surface-variant uppercase">
          / {isUnit ? `${quantity} ${grade.display_unit}${quantity === 1 ? "" : "s"}` : formatGrams(quantity)}
        </span>
      </div>

      <div className="mb-8">
        <h3 className="mb-4 text-sm font-semibold text-on-surface">{isUnit ? "Quantity" : "Select Weight"}</h3>

        {isUnit ? (
          <div className="flex items-center gap-4">
            <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))} className="flex h-10 w-10 items-center justify-center rounded-full border border-primary text-primary">
              <span className="material-symbols-outlined">remove</span>
            </button>
            <span className="w-8 text-center text-lg font-semibold text-primary">{qty}</span>
            <button type="button" onClick={() => setQty((q) => q + 1)} className="flex h-10 w-10 items-center justify-center rounded-full border border-primary text-primary">
              <span className="material-symbols-outlined">add</span>
            </button>
          </div>
        ) : (
          <>
            <div className="flex flex-wrap gap-3">
              {QUICK_WEIGHTS_G.map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => pickWeight(g)}
                  className={`rounded-full px-6 py-3 text-sm font-semibold transition-all duration-300 ${
                    grams === g && !customKg ? "bg-primary text-secondary-fixed shadow-md" : "border border-primary text-primary hover:bg-surface-container-low"
                  }`}
                >
                  {formatGrams(g)}
                </button>
              ))}
            </div>
            <div className="mt-4 flex items-center gap-3">
              <span className="text-sm text-on-surface-variant">Or enter custom:</span>
              <div className="flex w-48 items-center rounded-lg bg-surface-container-low p-1 shadow-inner">
                <input
                  type="number"
                  min={0.1}
                  step={0.1}
                  placeholder="e.g. 3.5"
                  value={customKg}
                  onChange={(e) => {
                    const val = e.target.value;
                    setCustomKg(val);
                    const num = parseFloat(val);
                    if (num > 0) setGrams(Math.round(num * 1000));
                  }}
                  className="w-full border-none bg-transparent p-2 text-center text-on-surface focus:ring-0 focus:outline-none"
                />
                <span className="pr-3 text-xs text-on-surface-variant">KG</span>
              </div>
            </div>
          </>
        )}
      </div>

      <button
        type="button"
        onClick={handleAdd}
        className="group flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-8 py-4 text-sm font-semibold text-secondary-fixed shadow-md transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
      >
        <span className="material-symbols-outlined">shopping_bag</span>
        Add to Cart
      </button>
    </div>
  );
}
