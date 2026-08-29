"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";
import { useCart } from "@/lib/cart-context";
import { formatCurrency, formatGrams } from "@/lib/format";
import { buildOrderMessage, buildWhatsAppLink, type DeliveryMethod, type PaymentMethod, PAYMENT_LABELS } from "@/lib/whatsapp";

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5 text-[13px]">
      <span className="text-ink/60">{label}</span>
      {children}
    </label>
  );
}

function generateOrderNo() {
  const now = new Date();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  const rand = String(Math.floor(Math.random() * 10000)).padStart(4, "0");
  return `SN-${mm}${dd}-${rand}`;
}

export default function CheckoutClient({ shopName, whatsappNumber }: { shopName: string; whatsappNumber: string | null }) {
  const router = useRouter();
  const { lines, subtotal, clearCart } = useCart();

  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>("delivery");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cod");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [placing, setPlacing] = useState(false);

  const handlePlaceOrder = () => {
    setError(null);
    if (!name.trim() || !phone.trim() || (deliveryMethod === "delivery" && !address.trim())) {
      setError("Please fill in your name, phone number, and delivery address.");
      return;
    }
    if (!whatsappNumber) {
      setError("Online ordering isn't configured yet — please call the shop directly.");
      return;
    }

    setPlacing(true);
    const orderNo = generateOrderNo();
    const customer = {
      name: name.trim(),
      phone: phone.trim(),
      address: deliveryMethod === "pickup" ? "Pickup at the shop" : address.trim(),
      notes: notes.trim(),
      deliveryMethod,
      paymentMethod,
      orderNo,
    };
    const message = buildOrderMessage(shopName, lines, customer, subtotal);

    try {
      sessionStorage.setItem(
        "swat-nayab-last-order",
        JSON.stringify({ orderNo, lines, total: subtotal, customer, placedAt: new Date().toISOString() })
      );
    } catch {
      // sessionStorage unavailable -- confirmation page just won't have order details to show
    }

    const link = buildWhatsAppLink(whatsappNumber, message);
    clearCart();
    window.open(link, "_blank", "noopener,noreferrer");
    router.push(`/order-confirmation?order=${orderNo}`);
  };

  if (lines.length === 0) {
    return (
      <div className="rounded-[28px] border border-dashed border-ink/20 bg-white p-14 text-center">
        <p className="text-sm text-ink/60">Your basket is empty — add something before checking out.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-7 lg:grid-cols-[1fr_336px] lg:items-start">
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-3xl">Checkout</h1>
          <p className="text-[13px] text-ink/55">No account — just a name and a number we can call if something needs confirming.</p>
        </div>

        <div className="rounded-[24px] border border-ink/10 bg-white p-5">
          <div className="mb-3 text-[10.5px] font-semibold tracking-[0.14em] text-ink/45 uppercase">How will you get it</div>
          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            {(["delivery", "pickup"] as DeliveryMethod[]).map((m) => (
              <label
                key={m}
                className={`flex cursor-pointer items-start gap-2.5 rounded-2xl px-4 py-3.5 ${
                  deliveryMethod === m ? "bg-green-deep text-cream" : "border border-ink/12 bg-stone-50"
                }`}
              >
                <input type="radio" name="delivery" className="sr-only" checked={deliveryMethod === m} onChange={() => setDeliveryMethod(m)} />
                <span className={`mt-0.5 h-3.5 w-3.5 shrink-0 rounded-full border-2 ${deliveryMethod === m ? "border-gold-400 bg-gold-400" : "border-ink/25"}`} />
                <span>
                  <span className="block text-sm font-semibold">{m === "delivery" ? "Delivery" : "Pickup at the shop"}</span>
                  <span className={`block text-[11.5px] ${deliveryMethod === m ? "text-stone-100/75" : "text-ink/55"}`}>
                    {m === "delivery" ? "Same day in Islamabad & Rawalpindi · fee confirmed on WhatsApp" : "Main PWD Road · ready in 2 hours"}
                  </span>
                </span>
              </label>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3 rounded-[24px] border border-ink/10 bg-white p-5">
          <div className="text-[10.5px] font-semibold tracking-[0.14em] text-ink/45 uppercase">Where it goes</div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Field label="Your name">
              <input value={name} onChange={(e) => setName(e.target.value)} className="checkout-input" />
            </Field>
            <Field label="Phone (we may call to confirm)">
              <input value={phone} onChange={(e) => setPhone(e.target.value)} className="checkout-input font-mono-num" placeholder="03XX XXXXXXX" />
            </Field>
          </div>
          {deliveryMethod === "delivery" && (
            <Field label="Delivery address">
              <input value={address} onChange={(e) => setAddress(e.target.value)} className="checkout-input" placeholder="House, street, area, city" />
            </Field>
          )}
          <Field label="Note for the shop (optional)">
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} className="checkout-input" placeholder="e.g. split into two packs" />
          </Field>
        </div>

        <div className="rounded-[24px] border border-ink/10 bg-white p-5">
          <div className="mb-3 text-[10.5px] font-semibold tracking-[0.14em] text-ink/45 uppercase">Payment</div>
          <div className="flex flex-col gap-2">
            {(Object.keys(PAYMENT_LABELS) as PaymentMethod[]).map((m) => (
              <label
                key={m}
                className={`flex cursor-pointer items-center gap-2.5 rounded-2xl px-4 py-3 ${
                  paymentMethod === m ? "border border-gold-500/60 bg-gold-100" : "border border-ink/12 bg-stone-50"
                }`}
              >
                <input type="radio" name="payment" className="sr-only" checked={paymentMethod === m} onChange={() => setPaymentMethod(m)} />
                <span className={`h-3.5 w-3.5 shrink-0 rounded-full border-2 ${paymentMethod === m ? "border-gold-500 bg-gold-500" : "border-ink/25"}`} />
                <span className="flex-1">
                  <span className="block text-sm font-semibold">{PAYMENT_LABELS[m]}</span>
                  <span className="block text-[11.5px] text-ink/55">
                    {m === "cod" ? "Pay the rider or at the counter." : "Transfer now, send the screenshot on WhatsApp."}
                  </span>
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>

      <aside className="flex flex-col gap-3.5 rounded-[26px] border border-ink/10 bg-white p-5 shadow-sm">
        <h2 className="text-xl">Order summary</h2>
        <div className="flex flex-col gap-2.5">
          {lines.map((l) => (
            <div key={l.gradeId} className="flex items-center gap-2.5 text-[12.5px]">
              <span className="relative h-11 w-11 shrink-0 overflow-hidden rounded-xl bg-stone-100">
                {l.imageUrl && <Image src={l.imageUrl} alt="" fill className="object-cover" />}
              </span>
              <span className="flex-1">
                <span className="block font-semibold">{l.gradeName ? `${l.productName} · ${l.gradeName}` : l.productName}</span>
                <span className="font-mono-num text-ink/50">
                  {l.pricingUnit === "unit" ? `${l.quantity} ${l.displayUnit}` : formatGrams(l.quantity)}
                </span>
              </span>
              <span className="font-mono-num font-semibold">{formatCurrency(l.pricePerBaseUnit * l.quantity)}</span>
            </div>
          ))}
        </div>
        <div className="h-px bg-ink/10" />
        <div className="flex flex-col gap-2 text-[13px]">
          <span className="flex justify-between">
            <span className="text-ink/65">Subtotal</span>
            <span className="font-mono-num">{formatCurrency(subtotal)}</span>
          </span>
          {deliveryMethod === "delivery" && (
            <span className="flex justify-between">
              <span className="text-ink/65">Delivery</span>
              <span className="text-ink/50">Confirmed on WhatsApp</span>
            </span>
          )}
        </div>
        <div className="flex items-baseline justify-between pt-1">
          <span className="font-heading text-lg">To pay {paymentMethod === "cod" ? "on delivery" : "now"}</span>
          <span className="font-mono-num text-2xl font-semibold">{formatCurrency(subtotal)}</span>
        </div>
        {error && <p className="rounded-xl border border-rose-200 bg-rose-50 p-2.5 text-xs font-semibold text-rose-600">{error}</p>}
        <button
          type="button"
          onClick={handlePlaceOrder}
          disabled={placing}
          className="rounded-2xl bg-gold-500 py-3.5 text-[14px] font-semibold text-green-deep hover:bg-gold-600 disabled:opacity-60"
        >
          {placing ? "Placing order…" : "Place order"}
        </button>
        <p className="text-[11.5px] leading-relaxed text-ink/50">
          Placing the order sends the details straight to the shop&rsquo;s WhatsApp. We call only if something&rsquo;s short.
        </p>
      </aside>
    </div>
  );
}
