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
      {/* Backdrop */}
      <div
        aria-hidden={!isOpen}
        onClick={() => setIsOpen(false)}
        className={`fixed inset-0 z-[60] bg-inverse-surface/40 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      {/* Panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Cart"
        className={`fixed inset-y-0 right-0 z-[70] flex w-full max-w-sm flex-col bg-surface-container-lowest shadow-2xl transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-outline-variant/30 px-6 py-5">
          <h2 className="font-serif text-2xl text-primary">Your Cart</h2>
          <button
            type="button"
            aria-label="Close cart"
            onClick={() => setIsOpen(false)}
            className="flex h-9 w-9 items-center justify-center rounded-full text-on-surface-variant transition hover:bg-surface-container hover:text-primary"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
            <span className="material-symbols-outlined text-4xl text-outline">shopping_bag</span>
            <p className="text-sm text-on-surface-variant">Your cart is empty.</p>
            <Link
              href="/shop"
              onClick={() => setIsOpen(false)}
              className="rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-secondary-fixed"
            >
              Browse the Collection
            </Link>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-6 py-4">
              <ul className="flex flex-col gap-5">
                {lines.map((line) => (
                  <li key={line.gradeId} className="flex gap-3">
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-surface-container">
                      {line.imageUrl ? (
                        <Image src={line.imageUrl} alt={line.productName} fill className="object-cover" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-outline">
                          <span className="material-symbols-outlined text-lg">nutrition</span>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-1 flex-col">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-sm font-semibold text-on-surface">{line.productName}</p>
                          {line.gradeName && <p className="text-xs text-on-surface-variant">{line.gradeName}</p>}
                        </div>
                        <button type="button" aria-label="Remove" onClick={() => removeLine(line.gradeId)} className="text-on-surface-variant hover:text-error">
                          <span className="material-symbols-outlined text-[18px]">close</span>
                        </button>
                      </div>
                      <div className="mt-2 flex items-center justify-between">
                        <div className="flex items-center rounded-full border border-outline-variant/30 bg-surface p-0.5">
                          <button type="button" aria-label="Decrease" onClick={() => step(line, -1)} className="flex h-6 w-6 items-center justify-center rounded-full hover:bg-surface-container">
                            <span className="material-symbols-outlined text-[14px]">remove</span>
                          </button>
                          <span className="min-w-[3.5rem] text-center text-xs font-semibold text-primary">
                            {line.pricingUnit === "unit" ? `${line.quantity} ${line.displayUnit}${line.quantity === 1 ? "" : "s"}` : formatGrams(line.quantity)}
                          </span>
                          <button type="button" aria-label="Increase" onClick={() => step(line, 1)} className="flex h-6 w-6 items-center justify-center rounded-full hover:bg-surface-container">
                            <span className="material-symbols-outlined text-[14px]">add</span>
                          </button>
                        </div>
                        <span className="text-sm font-semibold text-primary">{formatCurrency(line.pricePerBaseUnit * line.quantity)}</span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t border-outline-variant/30 px-6 py-5">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-sm font-semibold text-on-surface-variant">Subtotal</span>
                <span className="font-serif text-2xl text-primary">{formatCurrency(subtotal)}</span>
              </div>
              <Link
                href="/cart"
                onClick={() => setIsOpen(false)}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-primary py-3.5 text-sm font-semibold tracking-wide text-secondary-fixed uppercase shadow-md transition hover:-translate-y-0.5 hover:shadow-lg"
              >
                View Cart &amp; Checkout
              </Link>
            </div>
          </>
        )}
      </div>
    </>
  );
}
