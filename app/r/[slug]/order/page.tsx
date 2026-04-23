'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Check, ChefHat, Package, PartyPopper, Utensils, BellRing } from 'lucide-react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import { RESTAURANT } from '@/lib/mock-data';

const STEPS = [
  { id: 'submitted', label: 'Recebido', sub: 'Seu pedido foi enviado para a cozinha', icon: Check, after: 0 },
  { id: 'preparing', label: 'Preparando', sub: 'Fritando tudo quentinho no óleo limpo', icon: ChefHat, after: 20 },
  { id: 'ready', label: 'Pronto', sub: 'O garçom está indo até você', icon: Package, after: 60 },
  { id: 'delivered', label: 'Entregue', sub: 'Bom apetite!', icon: PartyPopper, after: 90 },
] as const;

export default function OrderPage() {
  const sp = useSearchParams();
  const number = sp.get('n') || 'A3B7';
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(id);
  }, []);

  const currentStep = useMemo(() => {
    // Demo: passa pelos passos em 90s
    if (elapsed >= 60) return 3;
    if (elapsed >= 20) return 2;
    if (elapsed >= 5) return 1;
    return 0;
  }, [elapsed]);

  const eta = Math.max(1, 12 - Math.floor(elapsed / 5));

  return (
    <>
      <Header title="Acompanhe seu pedido" showBack />

      {/* Sucesso */}
      <section className="px-4 pt-6 pb-4 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', damping: 12 }}
          className="w-20 h-20 mx-auto mb-3 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-warm"
        >
          <Check className="w-10 h-10 stroke-[3]" />
        </motion.div>
        <h1 className="text-2xl font-display font-bold text-brand-900">
          Pedido <span className="text-accent-500">#{number}</span> confirmado!
        </h1>
        <p className="text-sm text-gray-600 mt-1">
          Previsão de entrega: <strong>{eta} min</strong>
        </p>
      </section>

      {/* Timeline */}
      <section className="px-4 mb-5">
        <div className="bg-white rounded-2xl shadow-soft p-5">
          {STEPS.map((s, idx) => {
            const Icon = s.icon;
            const done = idx < currentStep;
            const active = idx === currentStep;
            return (
              <div key={s.id} className="flex gap-3 items-start relative">
                {/* Linha vertical */}
                {idx < STEPS.length - 1 && (
                  <div
                    className={`absolute left-[19px] top-10 w-0.5 h-[calc(100%-20px)] ${
                      done ? 'bg-emerald-500' : 'bg-cream-200'
                    }`}
                  />
                )}
                {/* Ícone */}
                <motion.div
                  animate={active ? { scale: [1, 1.08, 1] } : {}}
                  transition={{ repeat: active ? Infinity : 0, duration: 1.8 }}
                  className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                    done
                      ? 'bg-emerald-500 text-white'
                      : active
                      ? 'bg-brand text-white shadow-warm'
                      : 'bg-cream-100 text-gray-400'
                  }`}
                >
                  {done ? <Check className="w-5 h-5 stroke-[3]" /> : <Icon className="w-5 h-5" />}
                </motion.div>
                {/* Conteúdo */}
                <div className="pb-6 flex-1">
                  <div
                    className={`font-semibold ${
                      done || active ? 'text-brand-900' : 'text-gray-400'
                    }`}
                  >
                    {s.label}
                  </div>
                  <div
                    className={`text-xs ${
                      done || active ? 'text-gray-600' : 'text-gray-400'
                    }`}
                  >
                    {s.sub}
                  </div>
                  {active && (
                    <div className="mt-2 inline-flex items-center gap-1 text-[11px] font-medium text-brand-700">
                      <span className="w-1.5 h-1.5 bg-brand rounded-full animate-pulse-soft" />
                      Em andamento
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Ações */}
      <section className="px-4 mb-5 space-y-3">
        <Link
          href={`/r/${RESTAURANT.slug}`}
          className="flex items-center gap-3 bg-white rounded-2xl shadow-soft p-4 hover:shadow-hover transition-shadow"
        >
          <div className="w-10 h-10 rounded-full bg-brand/10 flex items-center justify-center text-brand-700">
            <Utensils className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <div className="font-semibold text-sm text-brand-900">
              Adicionar mais itens
            </div>
            <div className="text-xs text-gray-500">
              O pedido fica junto no mesmo ticket
            </div>
          </div>
          <span className="text-brand-700">→</span>
        </Link>

        <button className="w-full flex items-center gap-3 bg-white rounded-2xl shadow-soft p-4 hover:shadow-hover transition-shadow text-left">
          <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center text-amber-700">
            <BellRing className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <div className="font-semibold text-sm text-brand-900">Chamar o garçom</div>
            <div className="text-xs text-gray-500">Precisa de algo enquanto espera?</div>
          </div>
          <span className="text-brand-700">→</span>
        </button>
      </section>

      {/* Número grande */}
      <section className="px-4 mb-8">
        <div className="bg-gradient-to-br from-brand-700 to-brand-900 rounded-2xl shadow-warm p-5 text-center text-white">
          <div className="text-xs opacity-80 uppercase tracking-wider">Seu ticket</div>
          <div className="text-5xl font-display font-bold mt-1">#{number}</div>
          <div className="text-xs opacity-80 mt-2">
            Mostre este número ao garçom ou no caixa se precisar
          </div>
        </div>
      </section>
    </>
  );
}
