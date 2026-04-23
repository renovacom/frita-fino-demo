'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Trash2, Minus, Plus, Ticket, ShoppingBag, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '@/components/Header';
import { useCart } from '@/lib/cart-store';
import { RESTAURANT } from '@/lib/mock-data';
import { formatBRL, cn } from '@/lib/utils';

const COUPONS: Record<string, { label: string; type: 'pct' | 'fixed'; value: number }> = {
  BEMVINDO10: { label: 'Boas-vindas — 10% off', type: 'pct', value: 10 },
  FRITANA20: { label: 'Promo Fritana — R$ 20 off', type: 'fixed', value: 20 },
};

export default function CartPage() {
  const [mounted, setMounted] = useState(false);
  const [couponInput, setCouponInput] = useState('');
  const [coupon, setCoupon] = useState<null | { code: string; label: string; discount: number }>(null);
  const [tipPct, setTipPct] = useState(10);
  const router = useRouter();

  useEffect(() => setMounted(true), []);

  const items = useCart((s) => s.items);
  const updateQuantity = useCart((s) => s.updateQuantity);
  const removeItem = useCart((s) => s.removeItem);

  const subtotal = items.reduce(
    (acc, it) =>
      acc +
      (it.unitPrice + it.modifiers.reduce((a, m) => a + m.priceDelta, 0)) * it.quantity,
    0
  );
  const service = subtotal * (RESTAURANT.serviceFeePct / 100);
  const tip = (subtotal * tipPct) / 100;
  const discount = coupon?.discount ?? 0;
  const total = Math.max(0, subtotal + service + tip - discount);

  const applyCoupon = () => {
    const code = couponInput.trim().toUpperCase();
    const c = COUPONS[code];
    if (!c) {
      alert('Cupom inválido');
      return;
    }
    const disc = c.type === 'pct' ? (subtotal * c.value) / 100 : c.value;
    setCoupon({ code, label: c.label, discount: disc });
    setCouponInput('');
  };

  if (!mounted) {
    return (
      <>
        <Header title="Seu pedido" showBack />
        <div className="p-6 space-y-3">
          <div className="skeleton h-20 rounded-2xl" />
          <div className="skeleton h-20 rounded-2xl" />
        </div>
      </>
    );
  }

  if (items.length === 0) {
    return (
      <>
        <Header title="Seu pedido" showBack />
        <div className="flex flex-col items-center justify-center py-20 px-8 text-center">
          <div className="w-24 h-24 rounded-full bg-cream-100 flex items-center justify-center mb-4">
            <ShoppingBag className="w-10 h-10 text-brand-400" />
          </div>
          <h2 className="text-xl font-display font-bold text-brand-900 mb-1">
            Seu carrinho está vazio
          </h2>
          <p className="text-sm text-gray-600 mb-6">
            Que tal começar por uma coxinha crocante?
          </p>
          <Link
            href={`/r/${RESTAURANT.slug}`}
            className="px-6 py-3 bg-brand text-white rounded-xl font-semibold shadow-warm"
          >
            Ver cardápio
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
      <Header title="Seu pedido" showBack />
      <div className="px-4 py-4 pb-[180px]">
        {/* Items */}
        <div className="space-y-3 mb-5">
          <AnimatePresence initial={false}>
            {items.map((it) => {
              const modTotal = it.modifiers.reduce((a, m) => a + m.priceDelta, 0);
              const lineTotal = (it.unitPrice + modTotal) * it.quantity;
              return (
                <motion.div
                  key={it.lineId}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100, height: 0, marginBottom: 0 }}
                  className="bg-white rounded-2xl shadow-soft p-3 flex gap-3"
                >
                  <div
                    className="w-20 h-20 shrink-0 rounded-xl bg-image"
                    style={{ backgroundImage: `url(${it.image})` }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 leading-tight">
                        {it.name}
                      </h3>
                      <button
                        onClick={() => removeItem(it.lineId)}
                        className="w-7 h-7 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 flex items-center justify-center"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    {it.modifiers.length > 0 && (
                      <div className="text-[11px] text-gray-500 leading-snug mb-1">
                        {it.modifiers.map((m) => m.optionName).join(' · ')}
                      </div>
                    )}
                    {it.notes && (
                      <div className="text-[11px] italic text-gray-500 truncate">
                        “{it.notes}”
                      </div>
                    )}
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center bg-cream-100 rounded-lg">
                        <button
                          onClick={() => updateQuantity(it.lineId, it.quantity - 1)}
                          className="w-8 h-8 flex items-center justify-center text-brand-800"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-6 text-center text-sm font-semibold">
                          {it.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(it.lineId, it.quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center text-brand-800"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <span className="font-bold text-brand-800">
                        {formatBRL(lineTotal)}
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Cupom */}
        <div className="bg-white rounded-2xl shadow-soft p-4 mb-4">
          <div className="flex items-center gap-2 mb-3">
            <Ticket className="w-4 h-4 text-brand-700" />
            <h3 className="text-sm font-bold text-brand-900">Cupom de desconto</h3>
          </div>
          {coupon ? (
            <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-2">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-700" />
                <div>
                  <div className="text-sm font-semibold text-emerald-900">{coupon.code}</div>
                  <div className="text-xs text-emerald-700">{coupon.label}</div>
                </div>
              </div>
              <button
                onClick={() => setCoupon(null)}
                className="text-xs font-semibold text-emerald-800 hover:underline"
              >
                remover
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              <input
                value={couponInput}
                onChange={(e) => setCouponInput(e.target.value)}
                placeholder="Ex.: BEMVINDO10"
                className="flex-1 h-10 px-3 rounded-xl border border-cream-200 bg-cream-50 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300 uppercase"
              />
              <button
                onClick={applyCoupon}
                className="h-10 px-4 bg-brand text-white rounded-xl text-sm font-semibold hover:bg-brand-700"
              >
                Aplicar
              </button>
            </div>
          )}
        </div>

        {/* Gorjeta */}
        <div className="bg-white rounded-2xl shadow-soft p-4 mb-4">
          <h3 className="text-sm font-bold text-brand-900 mb-2">Gorjeta ao garçom</h3>
          <p className="text-xs text-gray-500 mb-3">
            O valor vai direto para a equipe, 100% opcional.
          </p>
          <div className="grid grid-cols-4 gap-2">
            {[0, 5, 10, 15].map((pct) => (
              <button
                key={pct}
                onClick={() => setTipPct(pct)}
                className={cn(
                  'h-10 rounded-xl text-sm font-semibold border-2 transition-colors',
                  tipPct === pct
                    ? 'bg-brand text-white border-brand'
                    : 'bg-white text-gray-700 border-cream-200 hover:border-brand-300'
                )}
              >
                {pct === 0 ? 'Sem' : `${pct}%`}
              </button>
            ))}
          </div>
        </div>

        {/* Resumo */}
        <div className="bg-white rounded-2xl shadow-soft p-4">
          <h3 className="text-sm font-bold text-brand-900 mb-3">Resumo</h3>
          <dl className="space-y-1.5 text-sm">
            <div className="flex justify-between text-gray-700">
              <dt>Subtotal</dt>
              <dd>{formatBRL(subtotal)}</dd>
            </div>
            <div className="flex justify-between text-gray-700">
              <dt>Taxa de serviço ({RESTAURANT.serviceFeePct}%)</dt>
              <dd>{formatBRL(service)}</dd>
            </div>
            {tip > 0 && (
              <div className="flex justify-between text-gray-700">
                <dt>Gorjeta ({tipPct}%)</dt>
                <dd>{formatBRL(tip)}</dd>
              </div>
            )}
            {discount > 0 && (
              <div className="flex justify-between text-emerald-700">
                <dt>Desconto</dt>
                <dd>−{formatBRL(discount)}</dd>
              </div>
            )}
            <div className="flex justify-between pt-2 border-t border-cream-200 text-base font-bold text-brand-900">
              <dt>Total</dt>
              <dd>{formatBRL(total)}</dd>
            </div>
          </dl>
        </div>
      </div>

      {/* CTA fixo */}
      <div className="fixed bottom-[76px] inset-x-0 z-30 px-4 pb-3">
        <div className="max-w-screen-sm mx-auto">
          <button
            onClick={() => router.push(`/r/${RESTAURANT.slug}/checkout`)}
            className="w-full h-14 bg-brand hover:bg-brand-700 text-white rounded-2xl font-bold shadow-warm flex items-center justify-center gap-2 text-base"
          >
            <span>Finalizar pedido</span>
            <span className="opacity-80">·</span>
            <span>{formatBRL(total)}</span>
          </button>
        </div>
      </div>
    </>
  );
}
