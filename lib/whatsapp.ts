import type { CartLine } from "./cart-context";
import { formatCurrency, formatGrams } from "./format";

// wa.me needs digits only, full country code, no leading 0/+. Shop numbers
// are entered in local Pakistani format (e.g. "0300 1234567") in the POS
// Settings tab, so a leading 0 gets swapped for the country code.
export function toWhatsAppNumber(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  if (digits.startsWith("0")) return `92${digits.slice(1)}`;
  return digits;
}

export type DeliveryMethod = "delivery" | "pickup";
export type PaymentMethod = "cod" | "easypaisa" | "jazzcash";

export const PAYMENT_LABELS: Record<PaymentMethod, string> = {
  cod: "Cash on delivery",
  easypaisa: "Easypaisa",
  jazzcash: "JazzCash",
};

export type CustomerDetails = {
  name: string;
  phone: string;
  address: string;
  notes?: string;
  deliveryMethod?: DeliveryMethod;
  paymentMethod?: PaymentMethod;
  orderNo?: string;
};

export function buildOrderMessage(shopName: string, lines: CartLine[], customer: CustomerDetails, total: number) {
  const itemLines = lines
    .map((l, i) => {
      const qtyLabel = l.pricingUnit === "unit" ? `${l.quantity} ${l.displayUnit}(s)` : formatGrams(l.quantity);
      const label = l.gradeName ? `${l.productName} (${l.gradeName})` : l.productName;
      return `${i + 1}. ${label} — ${qtyLabel} — ${formatCurrency(l.pricePerBaseUnit * l.quantity)}`;
    })
    .join("\n");

  const notesLine = customer.notes?.trim() ? `Notes: ${customer.notes.trim()}\n` : "";
  const orderNoLine = customer.orderNo ? `Order #: ${customer.orderNo}\n` : "";
  const deliveryLine = customer.deliveryMethod ? `${customer.deliveryMethod === "pickup" ? "Pickup at the shop" : "Delivery"}\n` : "";
  const paymentLine = customer.paymentMethod ? `Payment: ${PAYMENT_LABELS[customer.paymentMethod]}\n` : "";

  return (
    `*New Order — ${shopName}*\n\n` +
    orderNoLine +
    deliveryLine +
    paymentLine +
    `\n*Customer Details*\n` +
    `Name: ${customer.name}\n` +
    `Phone: ${customer.phone}\n` +
    `Address: ${customer.address}\n` +
    notesLine +
    `\n*Order Items*\n${itemLines}\n\n` +
    `*Total: ${formatCurrency(total)}*`
  );
}

export function buildWhatsAppLink(shopNumber: string, message: string) {
  return `https://wa.me/${toWhatsAppNumber(shopNumber)}?text=${encodeURIComponent(message)}`;
}
