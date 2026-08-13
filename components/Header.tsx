"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/lib/cart-context";

export default function Header() {
  const { lines, setIsOpen } = useCart();
  const pathname = usePathname();
  const itemCount = lines.length;
  const shopActive = pathname?.startsWith("/shop");

  return (
    <div className="pointer-events-none fixed inset-x-0 top-3 z-50 flex justify-center px-4">
      <header className="pointer-events-auto w-full max-w-[1280px] rounded-full border border-outline-variant/40 bg-surface-container-lowest/95 shadow-lg backdrop-blur-xl">
        <div className="flex h-16 items-center justify-between gap-4 px-4 sm:h-18 sm:px-6">
          <nav className="flex flex-1 items-center">
            <Link
              href="/shop"
              className={`rounded-full px-4 py-2 text-sm font-semibold transition-all ${
                shopActive ? "bg-primary text-secondary-fixed" : "text-on-surface-variant hover:text-primary"
              }`}
            >
              Shop
            </Link>
          </nav>

          <Link href="/" className="group flex shrink-0 items-center py-1 transition-transform hover:scale-105">
            <Image
              src="/logo.png"
              alt="Swat Nayab"
              width={56}
              height={56}
              priority
              className="h-12 w-12 rounded-full object-contain sm:h-14 sm:w-14"
            />
          </Link>

          <nav className="flex flex-1 items-center justify-end">
            <button
              type="button"
              aria-label="Open cart"
              onClick={() => setIsOpen(true)}
              className="relative flex h-10 w-10 items-center justify-center rounded-full bg-primary text-secondary-fixed transition-transform hover:scale-105"
            >
              <span className="material-symbols-outlined text-[20px]">shopping_bag</span>
              {itemCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-secondary-fixed text-[10px] font-bold text-primary ring-2 ring-surface-container-lowest">
                  {itemCount}
                </span>
              )}
            </button>
          </nav>
        </div>
      </header>
    </div>
  );
}
