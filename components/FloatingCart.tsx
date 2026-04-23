'use client';

import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';
import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useCart } from '@/lib/cart-store';
import { RESTAURANT } from '@/lib/mock-data';
import { formatBRL } from '@/lib/utils';

export default function FloatingCart() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const count = useCart((s) => s.items.reduce((a, i) => a + i.quantity, 0));
  const subtotal = useCart((s) =>
    s.items.reduce((a, i) => {
      const mod = i.modifiers.reduce((x, m) => x + m.priceDelta, 0);
      return a + (i.unitPrice + mod) * i.quantity;
    }, 0)
  );

  if (!mounted || count === 0) return null;

  return (
    <div className="fixed bottom-[76px] inset-x-0 z-30 px-4 pointer-events-none">
      <div className="max-w-screen-sm mx-auto pointer-events-auto">
        <AnimatePresence>
          <motion.div
            key="fc"
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 60, opacity: 0 }}
            transition={{ type: 'spring', damping: 22, stiffness: 240 }}
          >
            <Link
              href={`/r/${RESTAURANT.slug}/cart`}
              className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-brand text-white shadow-warm hover:bg-brand-700 transition-colors"
            >
              <div className="relative">
                <ShoppingBag className="w-6 h-6" />
                <span className="absolute -top-1 -right-1 bg-accent text-brand-900 text-[10px] font-bold rounded-full min-w-[18px] h-[18px] px-1 flex items-center justify-center">
                  {count}
                </span>
              </div>
              <span className="flex-1 font-semibold">Ver carrinho</span>
              <span className="font-bold">{formatBRL(subtotal)}</span>
            </Link>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
