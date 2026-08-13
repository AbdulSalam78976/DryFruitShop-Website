"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type CartLine = {
  gradeId: string;
  productName: string;
  gradeName: string;
  imageUrl: string | null;
  pricePerBaseUnit: number; // price per gram, or per unit for pricing_unit='unit'
  pricingUnit: "gram" | "unit";
  displayUnit: "kg" | "g" | "unit" | "box";
  quantity: number; // grams, or unit count
};

type CartContextValue = {
  lines: CartLine[];
  addLine: (line: CartLine) => void;
  updateQuantity: (gradeId: string, quantity: number) => void;
  removeLine: (gradeId: string) => void;
  clearCart: () => void;
  subtotal: number;
  count: number;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
};

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = "swat-nayab-cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      // localStorage doesn't exist during SSR, so this can't be a lazy
      // useState initializer -- has to run post-mount, which means one
      // extra render on hydration. Unavoidable for browser-only storage.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (stored) setLines(JSON.parse(stored));
    } catch {
      // ignore malformed/unavailable storage
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
      // storage full/unavailable -- cart just won't persist across reloads
    }
  }, [lines, hydrated]);

  const addLine = (line: CartLine) => {
    setLines((prev) => {
      const existing = prev.find((l) => l.gradeId === line.gradeId);
      if (existing) {
        return prev.map((l) =>
          l.gradeId === line.gradeId ? { ...l, quantity: l.quantity + line.quantity } : l
        );
      }
      return [...prev, line];
    });
    // Opening the drawer is the feedback that the add worked -- no separate toast needed.
    setIsOpen(true);
  };

  const updateQuantity = (gradeId: string, quantity: number) => {
    setLines((prev) => prev.map((l) => (l.gradeId === gradeId ? { ...l, quantity } : l)));
  };

  const removeLine = (gradeId: string) => {
    setLines((prev) => prev.filter((l) => l.gradeId !== gradeId));
  };

  const clearCart = () => setLines([]);

  const subtotal = lines.reduce((sum, l) => sum + l.pricePerBaseUnit * l.quantity, 0);
  const count = lines.length;

  return (
    <CartContext.Provider
      value={{ lines, addLine, updateQuantity, removeLine, clearCart, subtotal, count, isOpen, setIsOpen }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
