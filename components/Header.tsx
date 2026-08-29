"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { formatCurrency } from "@/lib/format";
import type { Category, Settings } from "@/lib/types";

export default function Header({ settings, categories }: { settings: Settings | null; categories: Category[] }) {
  const { lines, subtotal, setIsOpen } = useCart();
  const itemCount = lines.length;
  const shopName = settings?.shop_name || "Swat Nayab";

  return (
    <div className="sticky top-0 z-50">
      <header className="flex items-center gap-6 border-b border-ink/10 bg-cream px-4 py-3 sm:px-8">
        <Link href="/" className="flex shrink-0 items-center gap-2.5">
          <span className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full border border-gold/35 bg-white">
            <Image src="/logo.png" alt={shopName} width={40} height={40} className="h-10 w-10 object-contain" />
          </span>
          <span className="hidden font-heading text-xl sm:inline">{shopName}</span>
        </Link>

        <nav className="hidden items-center gap-7 text-[13.5px] font-medium md:flex">
          {categories.map((c) => (
            <Link
              key={c.id}
              href={`/shop?category=${c.id}`}
              className="border-b-2 border-transparent pb-0.5 text-ink transition hover:border-gold-400 hover:text-gold-600"
            >
              {c.name}
            </Link>
          ))}
          <Link href="/shop" className="border-b-2 border-transparent pb-0.5 text-ink/60 transition hover:border-gold-400 hover:text-gold-600">
            Gift boxes
          </Link>
        </nav>

        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="ml-auto flex items-center gap-2 rounded-full bg-gold-500 px-4 py-2.5 text-[13px] font-semibold text-green-deep transition hover:bg-gold-600 hover:text-cream"
        >
          <span className="material-symbols-outlined text-[16px]">shopping_bag</span>
          <span>{itemCount}</span>
          {subtotal > 0 && (
            <>
              <span className="opacity-35">|</span>
              <span className="font-mono-num">{formatCurrency(subtotal)}</span>
            </>
          )}
        </button>
      </header>
    </div>
  );
}
