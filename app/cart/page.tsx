import { getSettings } from "@/lib/db";
import CartClient from "@/components/CartClient";

export const dynamic = "force-dynamic";

export default async function CartPage() {
  const settings = await getSettings().catch(() => null);

  return (
    <div className="mx-auto w-full max-w-[1280px] px-4 pt-28 pb-20 lg:px-12">
      <header className="relative mb-12">
        <div className="absolute top-1/2 -left-8 hidden h-24 w-1 -translate-y-1/2 bg-secondary-fixed/30 lg:block" />
        <span className="mb-4 block text-xs font-semibold tracking-widest text-secondary-fixed uppercase">Your Selection</span>
        <h1 className="font-serif text-4xl text-primary sm:text-5xl">Shopping Cart</h1>
      </header>
      <CartClient shopName={settings?.shop_name || "Swat Nayab"} whatsappNumber={settings?.whatsapp_handle || null} />
    </div>
  );
}
