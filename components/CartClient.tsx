"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/lib/cart-context";
import { formatCurrency, formatGrams, pricePerDisplayUnit } from "@/lib/format";
import { buildOrderMessage, buildWhatsAppLink } from "@/lib/whatsapp";

const STEP_G = 100;

export default function CartClient({ shopName, whatsappNumber }: { shopName: string; whatsappNumber: string | null }) {
  const { lines, updateQuantity, removeLine, subtotal, clearCart } = useCart();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState<string | null>(null);

  const step = (line: (typeof lines)[number], direction: 1 | -1) => {
    const delta = line.pricingUnit === "unit" ? 1 : STEP_G;
    const next = Math.max(delta, line.quantity + direction * delta);
    updateQuantity(line.gradeId, next);
  };

  const handleCheckout = () => {
    setError(null);
    if (!name.trim() || !phone.trim() || !address.trim()) {
      setError("Please fill in your name, phone number and address.");
      return;
    }
    if (!whatsappNumber) {
      setError("Online ordering isn't set up yet — please call the shop directly.");
      return;
    }
    const message = buildOrderMessage(shopName, lines, { name, phone, address, notes }, subtotal);
    window.open(buildWhatsAppLink(whatsappNumber, message), "_blank");
    clearCart();
  };

  if (lines.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 py-16 text-center">
        <span className="material-symbols-outlined text-5xl text-outline">shopping_bag</span>
        <p className="text-on-surface-variant">Your cart is empty.</p>
        <Link href="/shop" className="rounded-full bg-primary px-8 py-3 text-sm font-semibold text-secondary-fixed shadow-md">
          Browse the Collection
        </Link>
      </div>
    );
  }

  return (
    <div className="grid w-full grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-16">
      <div className="space-y-6 lg:col-span-8">
        {lines.map((line) => (
          <div key={line.gradeId} className="group relative flex flex-col gap-6 overflow-hidden rounded-xl bg-surface-container p-6 sm:flex-row">
            <div className="relative h-32 w-full shrink-0 overflow-hidden rounded-lg bg-surface sm:w-32">
              {line.imageUrl ? (
                <Image src={line.imageUrl} alt={line.productName} fill className="object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-outline">
                  <span className="material-symbols-outlined">nutrition</span>
                </div>
              )}
            </div>
            <div className="flex flex-grow flex-col justify-between">
              <div className="flex w-full items-start justify-between">
                <div>
                  <h3 className="mb-1 font-serif text-xl text-primary">{line.productName}</h3>
                  {line.gradeName && (
                    <p className="flex items-center gap-2 text-sm text-on-surface-variant">
                      <span className="inline-block h-2 w-2 rounded-full bg-secondary-fixed" /> {line.gradeName}
                    </p>
                  )}
                </div>
                <button type="button" aria-label="Remove item" onClick={() => removeLine(line.gradeId)} className="-mt-2 -mr-2 p-2 text-on-surface-variant transition-colors hover:text-error">
                  <span className="material-symbols-outlined text-[20px]">close</span>
                </button>
              </div>
              <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
                <div className="space-y-2">
                  <span className="block text-xs tracking-wide text-on-surface-variant uppercase">
                    {line.pricingUnit === "unit" ? "Quantity" : "Selected Weight"}
                  </span>
                  <div className="flex items-center rounded-full border border-outline-variant/30 bg-surface p-1 shadow-sm">
                    <button type="button" aria-label="Decrease" onClick={() => step(line, -1)} className="flex h-8 w-8 items-center justify-center rounded-full text-on-surface-variant hover:bg-surface-container">
                      <span className="material-symbols-outlined text-[16px]">remove</span>
                    </button>
                    <span className="w-20 text-center text-sm font-semibold text-primary">
                      {line.pricingUnit === "unit" ? `${line.quantity} ${line.displayUnit}${line.quantity === 1 ? "" : "s"}` : formatGrams(line.quantity)}
                    </span>
                    <button type="button" aria-label="Increase" onClick={() => step(line, 1)} className="flex h-8 w-8 items-center justify-center rounded-full text-on-surface-variant hover:bg-surface-container">
                      <span className="material-symbols-outlined text-[16px]">add</span>
                    </button>
                  </div>
                </div>
                <div className="text-right">
                  <div className="mb-1 text-xs text-on-surface-variant">
                    {formatCurrency(pricePerDisplayUnit(line.pricePerBaseUnit, line.displayUnit))} / {line.displayUnit}
                  </div>
                  <div className="font-serif text-xl text-primary">{formatCurrency(line.pricePerBaseUnit * line.quantity)}</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="relative lg:col-span-4">
        <div className="sticky top-24 rounded-2xl bg-surface-container p-8 shadow-xl">
          <h2 className="mb-6 font-serif text-2xl text-primary">Order Summary</h2>
          <div className="mb-6 space-y-4 border-b border-outline-variant/30 pb-6 text-on-surface-variant">
            <div className="flex items-center justify-between">
              <span>Subtotal</span>
              <span className="font-semibold text-primary">{formatCurrency(subtotal)}</span>
            </div>
          </div>

          <div className="mb-8 flex items-end justify-between">
            <div>
              <span className="mb-1 block text-xs font-semibold tracking-wider text-on-surface-variant uppercase">Total Amount</span>
            </div>
            <div className="font-serif text-3xl text-primary">{formatCurrency(subtotal)}</div>
          </div>

          <div className="mb-6 flex flex-col gap-3">
            <h3 className="text-sm font-semibold text-on-surface">Delivery Details</h3>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full name"
              className="rounded-lg border border-outline-variant/30 bg-surface px-3 py-2.5 text-sm"
            />
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Phone number"
              className="rounded-lg border border-outline-variant/30 bg-surface px-3 py-2.5 text-sm"
            />
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Delivery address"
              rows={3}
              className="rounded-lg border border-outline-variant/30 bg-surface px-3 py-2.5 text-sm"
            />
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Notes (optional)"
              rows={2}
              className="rounded-lg border border-outline-variant/30 bg-surface px-3 py-2.5 text-sm"
            />
          </div>

          {error && <p className="mb-3 text-sm font-semibold text-error">{error}</p>}

          <button
            type="button"
            onClick={handleCheckout}
            className="group flex w-full items-center justify-center gap-2 rounded-full bg-primary py-4 text-sm font-semibold tracking-wider text-secondary-fixed uppercase shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg"
          >
            <span className="material-symbols-outlined text-[18px]">chat</span>
            Place Order via WhatsApp
          </button>
          <p className="mt-4 text-center text-xs text-on-surface-variant">
            You&apos;ll be taken to WhatsApp to send your order details directly to us.
          </p>

          <div className="mt-8 flex items-center justify-center gap-4 text-xs tracking-widest text-on-surface-variant/60 uppercase">
            <span className="h-px w-12 bg-outline-variant" />
            <span>Purity Guaranteed</span>
            <span className="h-px w-12 bg-outline-variant" />
          </div>
        </div>
      </div>
    </div>
  );
}
