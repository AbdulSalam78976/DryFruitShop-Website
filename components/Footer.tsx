import Image from "next/image";
import Link from "next/link";
import { getSettings, listCategories } from "@/lib/db";
import { toWhatsAppNumber } from "@/lib/whatsapp";

export default async function Footer() {
  const [settings, categories] = await Promise.all([getSettings().catch(() => null), listCategories().catch(() => [])]);
  const shopName = settings?.shop_name || "Swat Nayab";
  const address = settings?.shop_address || "Main PWD Road, Islamabad";

  return (
    <footer className="bg-green-deep px-6 py-11 text-stone-100 sm:px-8">
      <div className="mx-auto grid max-w-[1216px] grid-cols-1 gap-9 md:grid-cols-[1.5fr_1fr_1fr_1.1fr]">
        <div>
          <div className="mb-3.5 flex items-center gap-2.5">
            <span className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full bg-cream">
              <Image src="/logo.png" alt="" width={38} height={38} className="h-9.5 w-9.5 object-contain" />
            </span>
            <span className="flex flex-col">
              <span className="font-heading text-lg text-cream">{shopName}</span>
              <span className="text-[10.5px] tracking-[0.13em] text-gold-500 uppercase">Dry Fruits &amp; Pansar</span>
            </span>
          </div>
          <p className="max-w-[330px] text-xs leading-relaxed text-stone-100/60">
            A counter shop on Main PWD Road, now taking orders online. Everything is weighed to order — no pre-packed
            stock sitting on a shelf.
          </p>
        </div>

        <div>
          <div className="mb-3 text-[10.5px] font-semibold tracking-[0.14em] text-gold-500 uppercase">Shelves</div>
          <div className="flex flex-col gap-2 text-[12.5px] text-stone-100/80">
            {categories.map((c) => (
              <Link key={c.id} href={`/shop?category=${c.id}`} className="hover:text-gold-300">
                {c.name} {c.name_urdu ? `· ${c.name_urdu}` : ""}
              </Link>
            ))}
            <Link href="/shop" className="hover:text-gold-300">
              Gift trays &amp; hampers
            </Link>
          </div>
        </div>

        <div>
          <div className="mb-3 text-[10.5px] font-semibold tracking-[0.14em] text-gold-500 uppercase">Visit the shop</div>
          <div className="flex flex-col gap-2.5 text-[12.5px] leading-relaxed text-stone-100/80">
            <span className="flex gap-2">
              <span className="material-symbols-outlined mt-0.5 shrink-0 text-[16px] text-gold-500">location_on</span>
              <span>{address}</span>
            </span>
            <span className="flex gap-2">
              <span className="material-symbols-outlined mt-0.5 shrink-0 text-[16px] text-gold-500">schedule</span>
              <span>Open daily, 9am – 10pm</span>
            </span>
            {settings?.order_number && (
              <a href={`tel:${settings.order_number}`} className="flex gap-2 hover:text-gold-300">
                <span className="material-symbols-outlined mt-0.5 shrink-0 text-[16px] text-gold-500">call</span>
                <span>{settings.order_number}</span>
              </a>
            )}
          </div>
        </div>

        <div>
          <div className="mb-3 text-[10.5px] font-semibold tracking-[0.14em] text-gold-500 uppercase">Delivery &amp; payment</div>
          <div className="flex flex-col gap-2 text-[12.5px] text-stone-100/80">
            <span>Islamabad &amp; Rawalpindi, same day — fee confirmed on WhatsApp</span>
            <span>Cash on delivery · Easypaisa · JazzCash</span>
            <span>Pickup at the shop — free</span>
            {settings?.whatsapp_handle && (
              <a
                href={`https://wa.me/${toWhatsAppNumber(settings.whatsapp_handle)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 font-semibold text-gold-300 hover:text-gold-200"
              >
                Chat on WhatsApp
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="mx-auto mt-7 flex max-w-[1216px] flex-col gap-1 border-t border-stone-100/10 pt-4 text-[11px] text-stone-100/45 sm:flex-row sm:justify-between">
        <span>© {new Date().getFullYear()} {shopName} Dry Fruits &amp; Pansar</span>
        <span>Prices change with the market — the site is the source of truth.</span>
      </div>
    </footer>
  );
}
