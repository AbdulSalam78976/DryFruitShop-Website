"use client";

import Link from "next/link";
import type { Product } from "@/lib/types";
import { useCart } from "@/lib/cart-context";
import { formatCurrency, pricePerDisplayUnit } from "@/lib/format";

// Default quick-add quantity for the homepage bento tiles -- there's no
// weight selector here (no room for one), so this adds a sensible default;
// the product page is where you actually pick weight/variant precisely.
const DEFAULT_GRAMS = 500;

export default function FeatureTile({ product, large }: { product: Product; large?: boolean }) {
  const { addLine } = useCart();
  const grade = product.grades[0];
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
      quantity: grade.pricing_unit === "unit" ? 1 : DEFAULT_GRAMS,
    });
  };

  return (
    <div
      className={`group relative flex flex-col justify-end overflow-hidden rounded-2xl bg-surface-container shadow-sm transition-shadow duration-500 hover:shadow-xl ${
        large ? "min-h-[500px] md:col-span-7" : "min-h-[220px] flex-1"
      }`}
    >
      <Link href={`/shop/${product.id}`} className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
          style={imageUrl ? { backgroundImage: `url('${imageUrl}')` } : undefined}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/40 to-transparent" />
      </Link>

      <div className={`relative z-20 space-y-4 text-on-primary ${large ? "p-8" : "p-6"}`}>
        {large && (
          <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-full border border-secondary-fixed bg-primary-container/50 backdrop-blur-sm">
            <span className="material-symbols-outlined text-sm text-secondary-fixed">workspace_premium</span>
          </div>
        )}
        <Link href={`/shop/${product.id}`}>
          <h3 className={`font-serif ${large ? "text-3xl" : "text-2xl"}`}>{product.name}</h3>
          {large && grade && <p className="max-w-md text-surface-container-low">{product.name_urdu}</p>}
        </Link>
        <div className="flex items-center justify-between pt-4">
          {grade && (
            <span className="text-xl font-semibold text-secondary-fixed">
              {formatCurrency(pricePerDisplayUnit(grade.price, grade.display_unit))}{" "}
              <span className="text-sm font-normal text-outline-variant">/ {grade.display_unit}</span>
            </span>
          )}
          {large ? (
            <button
              type="button"
              aria-label="Add to cart"
              onClick={handleAdd}
              className="relative z-20 flex h-10 w-10 items-center justify-center rounded-full bg-secondary-fixed text-primary transition-transform hover:scale-110"
            >
              <span className="material-symbols-outlined text-[20px]">add</span>
            </button>
          ) : (
            <Link
              href={`/shop/${product.id}`}
              className="relative z-20 flex h-10 w-10 items-center justify-center rounded-full bg-secondary-fixed text-primary transition-transform group-hover:scale-110"
            >
              <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
