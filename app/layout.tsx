import type { Metadata } from "next";
import { Libre_Caslon_Text, Plus_Jakarta_Sans, Noto_Nastaliq_Urdu, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/lib/cart-context";
import { getSettings, listCategories } from "@/lib/db";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";

const libreCaslon = Libre_Caslon_Text({
  variable: "--font-libre-caslon",
  weight: ["400", "700"],
  subsets: ["latin"],
});

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
});

const notoNastaliq = Noto_Nastaliq_Urdu({
  variable: "--font-noto-nastaliq",
  subsets: ["arabic"],
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  weight: ["400", "500", "600"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Swat Nayab | Premium Dry Fruits & Pansar",
  description:
    "The purest dry fruits and heritage pansar treasures, sourced directly from the Swat Valley.",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const [settings, categories] = await Promise.all([
    getSettings().catch(() => null),
    listCategories().catch(() => []),
  ]);

  return (
    <html
      lang="en"
      className={`${libreCaslon.variable} ${plusJakarta.variable} ${notoNastaliq.variable} ${ibmPlexMono.variable} h-full antialiased`}
    >
      {/* Next.js hoists <link>/<meta> rendered anywhere in the tree into
          <head> automatically -- more reliable here than a CSS @import,
          which Turbopack was silently dropping (that's why every icon was
          rendering as literal text like "shopping_bag"). The no-page-custom-font
          rule below is a false positive: it predates the App Router and
          doesn't know root layout.tsx *is* the document, not a page. */}
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <link
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
        rel="stylesheet"
      />
      <body className="flex min-h-full flex-col bg-cream font-sans text-ink">
        <CartProvider>
          <Header settings={settings} categories={categories} />
          <main className="w-full flex-1">{children}</main>
          <Footer />
          <CartDrawer />
          <FloatingWhatsApp />
        </CartProvider>
      </body>
    </html>
  );
}
