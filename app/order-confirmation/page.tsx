import OrderConfirmationClient from "@/components/OrderConfirmationClient";
import { getSettings } from "@/lib/db";

export default async function OrderConfirmationPage({ searchParams }: { searchParams: Promise<{ order?: string }> }) {
  const [settings, params] = await Promise.all([getSettings().catch(() => null), searchParams]);

  return <OrderConfirmationClient settings={settings} orderNoFromUrl={params.order ?? null} />;
}
