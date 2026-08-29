import CheckoutClient from "@/components/CheckoutClient";
import { getSettings } from "@/lib/db";

export default async function CheckoutPage() {
  const settings = await getSettings().catch(() => null);

  return (
    <div className="mx-auto w-full max-w-[1216px] px-4 py-8 sm:px-8">
      <CheckoutClient shopName={settings?.shop_name || "Swat Nayab"} whatsappNumber={settings?.whatsapp_handle ?? null} />
    </div>
  );
}
