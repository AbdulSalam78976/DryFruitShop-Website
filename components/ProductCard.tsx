"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { Product } from "@/lib/types";
import { useCart } from "@/lib/cart-context";
import { formatCurrency, formatGrams, pricePerDisplayUnit } from "@/lib/format";

const QUICK_WEIGHTS_G = [250, 500, 1000];

export default function ProductCard({ product }: { product: Product }) {
  const { addLine } = useCart();
  const grade = product.grades[0];
  const isUnit = grade?.pricing_unit === "unit";
  const [grams, setGrams] = useState(QUICK_WEIGHTS_G[0]);
  const imageUrl = grade?.image_url || product.image_url;

  const handleAdd = () => {
    if (!grade) return;
    addLine({
      gradeId: grade.id,
      productName: product.name,
      gradeName: grade.name,
      imageUrl: grade.image_url || product.image_url,
      pricePerBaseUnit: grade.price,
      pricingUnit: grade.pricing_unit,
      displayUnit: grade.display_unit,
      quantity: isUnit ? 1 : grams,
    });
  };

  return (
    <div className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-transparent bg-surface transition-all duration-500 hover:-translate-y-2 hover:border-secondary-fixed-dim/30 hover:shadow-[0_20px_40px_rgba(212,175,55,0.08)]">
      <Link href={`/shop/${product.id}`} className="block">
        <div className="relative flex aspect-[4/5] items-center justify-center overflow-hidden bg-surface-container-lowest p-6">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={product.name}
              fill
              className="scale-95 object-cover drop-shadow-xl transition-transform duration-700 ease-out group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-outline">
              <span className="material-symbols-outlined text-4xl">nutrition</span>
            </div>
          )}
          <div className="absolute top-4 right-4 flex h-12 w-12 items-center justify-center rounded-full bg-surface/90 shadow-sm backdrop-blur-sm">
            <span className="material-symbols-outlined icon-fill text-[20px] text-secondary-fixed">workspace_premium</span>
          </div>
        </div>

        <div className="p-6 pb-0">
          <h3 className="font-serif text-xl text-primary transition-colors group-hover:text-primary-container">{product.name}</h3>
          {product.name_urdu && <p className="font-nastaliq text-lg text-on-surface-variant opacity-80">{product.name_urdu}</p>}
          {product.description && <p className="mt-2 line-clamp-2 text-sm text-on-surface-variant">{product.description}</p>}
        </div>
      </Link>

      <div className="mt-auto p-6 pt-4">
        {grade && !isUnit && (
          <div className="mb-4 flex gap-2">
            {QUICK_WEIGHTS_G.map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => setGrams(g)}
                className={`rounded px-3 py-1 text-xs font-semibold transition-colors ${
                  grams === g ? "bg-primary text-secondary-fixed shadow-sm" : "border border-primary/20 text-primary hover:border-primary"
                }`}
              >
                {formatGrams(g)}
              </button>
            ))}
          </div>
        )}
        <div className="flex items-center justify-between">
          {grade && (
            <span className="font-serif text-2xl text-primary">
              {formatCurrency(pricePerDisplayUnit(grade.price, grade.display_unit))}
            </span>
          )}
          <button
            type="button"
            aria-label="Add to cart"
            onClick={handleAdd}
            className="flex h-12 w-12 items-center justify-center rounded-full bg-primary shadow-md transition-all hover:scale-110 hover:bg-primary-container"
          >
            <span className="material-symbols-outlined text-secondary-fixed">add</span>
          </button>
        </div>
      </div>
    </div>
  );
}
