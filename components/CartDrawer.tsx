"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { formatCurrency, formatGrams } from "@/lib/format";

const STEP_G = 100;

export default function CartDrawer() {
  const { lines, isOpen, setIsOpen, updateQuantity, removeLine, subtotal } = useCart();

  const step = (line: (typeof lines)[number], direction: 1 | -1) => {
    const delta = line.pricingUnit === "unit" ? 1 : STEP_G;
    const next = Math.max(delta, line.quantity + direction * delta);
    updateQuantity(line.gradeId, next);
  };

  return (
    <>
      <div
        aria-hidden={!isOpen}
        onClick={() => setIsOpen(false)}
        className={`fixed inset-0 z-[60] bg-ink/60 backdrop-blur-xs transition-opacity duration-300 ${
          isOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label="Cart"
        className={`fixed inset-y-0 right-0 z-[70] flex w-full max-w-md flex-col border-l border-ink/10 bg-cream shadow-2xl transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-gold-300/20 bg-green-deep px-6 py-4">
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-[22px] text-gold-400">shopping_bag</span>
            <h2 className="font-heading text-lg text-gold-200">Your basket</h2>
          </div>
          <button
            type="button"
            aria-label="Close cart"
            onClick={() => setIsOpen(false)}
            className="flex h-8 w-8 items-center justify-center rounded-full text-gold-200 transition hover:bg-cream/10"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gold-100 text-gold-600">
              <span className="material-symbols-outlined text-3xl">shopping_bag</span>
            </div>
            <p className="text-sm font-semibold text-ink">Your basket is empty</p>
            <p className="max-w-xs text-xs text-ink/55">Browse the shelves and add whatever you&rsquo;re after.</p>
            <Link
              href="/shop"
              onClick={() => setIsOpen(false)}
              className="mt-2 rounded-full bg-green-deep px-6 py-2.5 text-xs font-semibold text-gold-200 hover:bg-green-700"
            >
              Browse the shop
            </Link>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-6 py-4">
              <ul className="flex flex-col gap-3">
                {lines.map((line) => (
                  <li key={line.gradeId} className="flex gap-3 rounded-2xl border border-ink/10 bg-white p-3">
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-stone-100">
                      {line.imageUrl ? (
                        <Image src={line.imageUrl} alt={line.productName} fill className="object-cover" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-stone-400">
                          <span className="material-symbols-outlined text-lg">nutrition</span>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-1 flex-col justify-between">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-heading text-sm">{line.productName}</p>
                          {line.gradeName && <p className="text-[11px] font-semibold text-gold-700">{line.gradeName}</p>}
                        </div>
                        <button type="button" aria-label="Remove" onClick={() => removeLine(line.gradeId)} className="text-ink/35 hover:text-rose-600">
                          <span className="material-symbols-outlined text-[18px]">close</span>
                        </button>
                      </div>
                      <div className="flex items-center justify-between pt-1">
                        <div className="flex items-center rounded-full border border-ink/12 bg-stone-50 p-0.5">
                          <button type="button" aria-label="Decrease" onClick={() => step(line, -1)} className="flex h-6 w-6 items-center justify-center rounded-full text-ink/70 hover:bg-white">
                            <span className="material-symbols-outlined text-[14px]">remove</span>
                          </button>
                          <span className="font-mono-num min-w-[3rem] text-center text-[11px] font-semibold">
                            {line.pricingUnit === "unit" ? `${line.quantity} ${line.displayUnit}` : formatGrams(line.quantity)}
                          </span>
                          <button type="button" aria-label="Increase" onClick={() => step(line, 1)} className="flex h-6 w-6 items-center justify-center rounded-full text-ink/70 hover:bg-white">
                            <span className="material-symbols-outlined text-[14px]">add</span>
                          </button>
                        </div>
                        <span className="font-mono-num text-xs font-semibold">{formatCurrency(line.pricePerBaseUnit * line.quantity)}</span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t border-ink/10 bg-white p-6">
              <div className="mb-4 flex items-baseline justify-between">
                <span className="text-[10.5px] font-semibold tracking-[0.14em] text-ink/45 uppercase">Subtotal</span>
                <span className="font-mono-num text-2xl font-semibold">{formatCurrency(subtotal)}</span>
              </div>
              <p className="mb-3 text-[11px] text-ink/50">Delivery fee, if any, is confirmed on WhatsApp.</p>
              <Link
                href="/checkout"
                onClick={() => setIsOpen(false)}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gold-500 py-3.5 text-[13.5px] font-semibold text-green-deep hover:bg-gold-600"
              >
                <span>Continue to checkout</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </Link>
            </div>
          </>
        )}
      </div>
    </>
  );
}
