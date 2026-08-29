"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { formatCurrency, formatGrams } from "@/lib/format";
import type { CartLine } from "@/lib/cart-context";
import type { PaymentMethod, DeliveryMethod } from "@/lib/whatsapp";
import { PAYMENT_LABELS } from "@/lib/whatsapp";
import type { Settings } from "@/lib/types";

type StoredOrder = {
  orderNo: string;
  lines: CartLine[];
  total: number;
  customer: {
    name: string;
    phone: string;
    address: string;
    notes?: string;
    deliveryMethod?: DeliveryMethod;
    paymentMethod?: PaymentMethod;
  };
};

export default function OrderConfirmationClient({ settings, orderNoFromUrl }: { settings: Settings | null; orderNoFromUrl: string | null }) {
  const [orderData, setOrderData] = useState<StoredOrder | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("swat-nayab-last-order");
      // sessionStorage doesn't exist during SSR, so this can't be a lazy
      // useState initializer -- has to run post-mount.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (raw) setOrderData(JSON.parse(raw));
    } catch {
      // sessionStorage unavailable
    }
    setHydrated(true);
  }, []);

  if (!hydrated) return null;

  const orderNo = orderData?.orderNo || orderNoFromUrl;
  const isPickup = orderData?.customer.deliveryMethod === "pickup";
  const paymentLabel = orderData?.customer.paymentMethod ? PAYMENT_LABELS[orderData.customer.paymentMethod] : null;

  return (
    <div className="mx-auto w-full max-w-[880px] px-4 py-8 sm:px-8">
      <div className="overflow-hidden rounded-[28px] border border-ink/10 bg-white shadow-sm">
        <div className="relative overflow-hidden bg-green-deep px-7 py-8 sm:px-9">
          <span
            className="pointer-events-none absolute -top-20 -right-16 h-64 w-64 rounded-full"
            style={{ background: "radial-gradient(circle at 42% 42%, rgba(201,144,31,.32), rgba(201,144,31,0) 68%)" }}
          />
          <div className="relative flex items-center gap-5">
            <span className="grid h-16 w-16 shrink-0 place-items-center rounded-full bg-gold-500">
              <span className="material-symbols-outlined text-[30px] text-green-deep">check</span>
            </span>
            <div>
              <h1 className="text-[28px] text-cream sm:text-[31px]">Order placed. We&rsquo;re weighing it now.</h1>
              <p className="mt-1 text-[13px] text-gold-300">You&rsquo;ll get a call if anything needs confirming.</p>
            </div>
          </div>
          <div className="relative mt-5 flex flex-wrap gap-6 border-t border-gold-300/20 pt-4">
            <div>
              <div className="text-[10px] tracking-[0.14em] text-gold-300/70 uppercase">Order number</div>
              <div className="font-mono-num text-lg font-semibold text-cream">{orderNo || "—"}</div>
            </div>
            {orderData && (
              <div>
                <div className="text-[10px] tracking-[0.14em] text-gold-300/70 uppercase">
                  Total{paymentLabel ? `, ${paymentLabel.toLowerCase()}` : ""}
                </div>
                <div className="font-mono-num text-lg font-semibold text-cream">{formatCurrency(orderData.total)}</div>
              </div>
            )}
            <div>
              <div className="text-[10px] tracking-[0.14em] text-gold-300/70 uppercase">{isPickup ? "Ready" : "Arriving"}</div>
              <div className="pt-0.5 text-[15px] text-cream">{isPickup ? "In about 2 hours" : "Today"}</div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-5 px-7 py-7 sm:px-9">
          <div>
            <div className="mb-3 text-[10.5px] font-semibold tracking-[0.14em] text-ink/45 uppercase">What happens next</div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                { label: "Confirmed", hint: "Just now — slip printed at the shop", active: true },
                { label: "Weighing & sealing", hint: "Within the hour", active: true },
                { label: isPickup ? "Ready for pickup" : "Out with the rider", hint: isPickup ? "We'll call when it's ready" : "You'll get a call before it arrives", active: false },
                { label: isPickup ? "Picked up" : "Delivered", hint: isPickup ? "Pay at the counter" : paymentLabel === "Cash on delivery" ? "Pay the rider in cash" : "Enjoy!", active: false },
              ].map((step) => (
                <div key={step.label} className="flex flex-col gap-2">
                  <span className={`h-1 rounded-full ${step.active ? "bg-gold-500" : "bg-stone-200"}`} />
                  <span className={`text-[13px] font-semibold ${step.active ? "" : "text-ink/55"}`}>{step.label}</span>
                  <span className="text-[11.5px] text-ink/50">{step.hint}</span>
                </div>
              ))}
            </div>
          </div>

          {orderData && (
            <div className="grid gap-3.5 sm:grid-cols-2">
              <div className="rounded-[22px] border border-ink/10 p-4.5">
                <div className="mb-2.5 text-[10.5px] font-semibold tracking-[0.14em] text-ink/45 uppercase">Going to</div>
                <div className="text-[13.5px] leading-relaxed">
                  {orderData.customer.name}
                  <br />
                  <span className="font-mono-num">{orderData.customer.phone}</span>
                  <br />
                  <span className="text-ink/60">{orderData.customer.address}</span>
                </div>
                {orderData.customer.notes && <div className="mt-2.5 text-xs text-ink/50">Note: {orderData.customer.notes}</div>}
              </div>
              <div className="rounded-[22px] border border-ink/10 p-4.5">
                <div className="mb-2.5 text-[10.5px] font-semibold tracking-[0.14em] text-ink/45 uppercase">In the bag</div>
                <div className="flex flex-col gap-1.5 text-[12.5px]">
                  {orderData.lines.map((l) => (
                    <span key={l.gradeId} className="flex justify-between gap-3">
                      <span>
                        {l.productName}
                        {l.gradeName ? ` · ${l.gradeName}` : ""} ·{" "}
                        <span className="font-mono-num">
                          {l.pricingUnit === "unit" ? `${l.quantity} ${l.displayUnit}` : formatGrams(l.quantity)}
                        </span>
                      </span>
                      <span className="font-mono-num shrink-0">{formatCurrency(l.pricePerBaseUnit * l.quantity)}</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center gap-3 rounded-[22px] bg-gold-100 px-5 py-4">
            <span className="material-symbols-outlined shrink-0 text-[20px] text-gold-800">location_on</span>
            <div className="flex-1 text-[12.5px] leading-relaxed text-gold-800">
              Something wrong with the order? Come by the shop{settings?.shop_address ? ` at ${settings.shop_address}` : ""}
              {orderNo ? (
                <>
                  {" "}
                  and quote <span className="font-mono-num font-semibold">{orderNo}</span>.
                </>
              ) : (
                "."
              )}
            </div>
            {settings?.complaint_number && (
              <a href={`tel:${settings.complaint_number}`} className="shrink-0 rounded-full border border-dashed border-gold-800/45 px-3 py-1.5 text-[11px] text-gold-800">
                {settings.complaint_number}
              </a>
            )}
          </div>

          <div className="flex gap-2.5">
            <Link href="/" className="rounded-2xl bg-green-deep px-5 py-3 text-[13.5px] font-semibold text-gold-200">
              Back to the shop
            </Link>
            <button type="button" onClick={() => window.print()} className="rounded-2xl border border-ink/15 px-5 py-3 text-[13.5px] font-semibold">
              Save the receipt
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
