import type { Metadata } from "next";
import { Libre_Caslon_Text, Plus_Jakarta_Sans, Noto_Nastaliq_Urdu } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/lib/cart-context";
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

export const metadata: Metadata = {
  title: "Swat Nayab | Premium Dry Fruits & Pansar",
  description:
    "The purest dry fruits and heritage pansar treasures, sourced directly from the Swat Valley.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${libreCaslon.variable} ${plusJakarta.variable} ${notoNastaliq.variable} h-full antialiased`}
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
      <body className="flex min-h-full flex-col bg-background font-sans text-on-surface">
        <CartProvider>
          <Header />
          <main className="w-full flex-1">{children}</main>
          <Footer />
          <CartDrawer />
          <FloatingWhatsApp />
        </CartProvider>
      </body>
    </html>
  );
}
