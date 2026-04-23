'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem } from './types';
import { uid } from './utils';

interface CartState {
  items: CartItem[];
  lastAdded?: { productId: string; at: number };
  addItem: (item: Omit<CartItem, 'lineId'>) => void;
  removeItem: (lineId: string) => void;
  updateQuantity: (lineId: string, quantity: number) => void;
  clear: () => void;
  subtotal: () => number;
  itemCount: () => number;
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) =>
        set((state) => ({
          items: [...state.items, { ...item, lineId: uid() }],
          lastAdded: { productId: item.productId, at: Date.now() },
        })),
      removeItem: (lineId) =>
        set((state) => ({ items: state.items.filter((i) => i.lineId !== lineId) })),
      updateQuantity: (lineId, quantity) =>
        set((state) => ({
          items: state.items
            .map((i) => (i.lineId === lineId ? { ...i, quantity } : i))
            .filter((i) => i.quantity > 0),
        })),
      clear: () => set({ items: [] }),
      subtotal: () =>
        get().items.reduce((acc, it) => {
          const modifiersDelta = it.modifiers.reduce((a, m) => a + m.priceDelta, 0);
          return acc + (it.unitPrice + modifiersDelta) * it.quantity;
        }, 0),
      itemCount: () => get().items.reduce((acc, it) => acc + it.quantity, 0),
    }),
    { name: 'ff-cart' }
  )
);
