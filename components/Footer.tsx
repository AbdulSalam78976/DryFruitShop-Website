import Image from "next/image";
import { getSettings } from "@/lib/db";

const HERITAGE_LINKS = ["Swat Valley Story", "Pansar Traditions", "Sourcing Map", "Our Farmers"];

export default async function Footer() {
  const settings = await getSettings().catch(() => null);
  const shopName = settings?.shop_name || "Swat Nayab";

  return (
    <footer className="border-t border-on-primary-fixed-variant bg-primary px-4 py-20 text-on-primary lg:px-12">
      <div className="mx-auto grid max-w-[1280px] grid-cols-1 gap-20 md:grid-cols-4">
        <div className="col-span-1 space-y-2 md:col-span-2">
          <div className="mb-4 flex items-center gap-2">
            <Image src="/logo.png" alt="" width={40} height={40} className="h-10 w-10 rounded-full object-contain brightness-0 invert" />
            <span className="font-serif text-2xl text-secondary-fixed">{shopName}</span>
          </div>
          <p className="max-w-md text-secondary-fixed-dim">
            Born in the heart of the Swat Valley, we bring the purest, organic dry fruits and heritage treasures
            from the Swiss of the East. Every product is a story of purity, tradition, and the emerald mountains.
          </p>
          <div className="flex gap-4 pt-4">
            <span className="material-symbols-outlined text-secondary-fixed">verified</span>
            <span className="text-xs">Certified Organic</span>
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="mb-4 font-serif text-2xl text-secondary-fixed">Heritage</h4>
          <ul className="space-y-2 text-secondary-fixed-dim">
            {HERITAGE_LINKS.map((label) => (
              <li key={label} className="cursor-default transition-colors hover:text-secondary-fixed">
                {label}
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-2">
          <h4 className="mb-4 font-serif text-2xl text-secondary-fixed">Newsletter</h4>
          <p className="text-xs text-secondary-fixed-dim">Subscribe for seasonal harvest alerts and exclusive offers.</p>
          <div className="flex items-center border-b border-secondary-fixed-dim py-2">
            <input
              type="email"
              placeholder="Your email address"
              className="w-full border-none bg-transparent text-on-primary placeholder:text-secondary-fixed-dim/50 focus:outline-none"
            />
            <span className="material-symbols-outlined text-secondary-fixed">arrow_forward</span>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-20 flex max-w-[1280px] flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-xs text-secondary-fixed-dim md:flex-row">
        <span>
          &copy; {new Date().getFullYear()} {shopName} Dry Fruits &amp; Pansar. All rights reserved.
        </span>
        <div className="flex gap-8">
          <span>Terms &amp; Conditions</span>
          <span>Privacy Policy</span>
        </div>
      </div>
    </footer>
  );
}
