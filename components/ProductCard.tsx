"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { Product } from "@/lib/types";
import { useCart } from "@/lib/cart-context";
import { formatCurrency, formatGrams, pricePerDisplayUnit } from "@/lib/format";
import { resolveImageUrl } from "@/lib/image";

const DEFAULT_GRAMS = 250;
const STEP_G = 100;

export default function ProductCard({ product }: { product: Product }) {
  const { addLine } = useCart();
  const grade = product.grades[0];
  const isUnit = grade?.pricing_unit === "unit";
  const [qty, setQty] = useState(isUnit ? 1 : DEFAULT_GRAMS);
  const imageUrl = resolveImageUrl(product, grade?.image_url);

  const step = (direction: 1 | -1) => {
    const delta = isUnit ? 1 : STEP_G;
    setQty((q) => Math.max(delta, q + direction * delta));
  };

  const handleAdd = () => {
    if (!grade) return;
    addLine({
      gradeId: grade.id,
      productName: product.name,
      gradeName: grade.name,
      imageUrl: resolveImageUrl(product, grade.image_url),
      pricePerBaseUnit: grade.price,
      pricingUnit: grade.pricing_unit,
      displayUnit: grade.display_unit,
      quantity: qty,
    });
  };

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-[22px] border border-ink/10 bg-white shadow-sm">
      <Link href={`/product/${product.id}`} className="relative block aspect-square overflow-hidden bg-stone-100">
        {imageUrl ? (
          <Image src={imageUrl} alt={product.name} fill className="object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-stone-400">
            <span className="material-symbols-outlined text-4xl">nutrition</span>
          </div>
        )}
      </Link>
      <div className="flex flex-1 flex-col gap-1.5 p-3.5">
        <Link href={`/product/${product.id}`}>
          <h3 className="truncate font-heading text-base leading-tight">{product.name}</h3>
          {product.name_urdu && <p className="font-urdu truncate text-xs text-green-700">{product.name_urdu}</p>}
        </Link>
        {grade && (
          <>
            <div className="mt-1 flex items-baseline gap-1">
              <span className="font-mono-num text-base font-semibold">
                {formatCurrency(pricePerDisplayUnit(grade.price, grade.display_unit))}
              </span>
              <span className="text-[11px] text-ink/50">/{grade.display_unit}</span>
            </div>
            <div className="mt-auto flex items-center gap-2 pt-1.5">
              <div className="flex flex-1 items-center justify-between rounded-full border border-ink/10 bg-stone-50 px-1 py-1">
                <button
                  type="button"
                  aria-label="Decrease quantity"
                  onClick={() => step(-1)}
                  className="flex h-6 w-6 items-center justify-center rounded-full text-ink/60 hover:bg-white"
                >
                  <span className="material-symbols-outlined text-[15px]">remove</span>
                </button>
                <span className="font-mono-num text-[11.5px] font-semibold">{isUnit ? qty : formatGrams(qty)}</span>
                <button
                  type="button"
                  aria-label="Increase quantity"
                  onClick={() => step(1)}
                  className="flex h-6 w-6 items-center justify-center rounded-full text-ink/60 hover:bg-white"
                >
                  <span className="material-symbols-outlined text-[15px]">add</span>
                </button>
              </div>
              <button
                type="button"
                onClick={handleAdd}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gold-500 text-green-deep transition hover:bg-gold-600"
                aria-label="Add to cart"
              >
                <span className="material-symbols-outlined text-[18px]">add_shopping_cart</span>
              </button>
            </div>
          </>
        )}
      </div>
    </article>
  );
}
