'use client';

import { Gift, Sparkles, Trophy, Copy, Check } from 'lucide-react';
import Header from '@/components/Header';
import { useState } from 'react';
import { motion } from 'framer-motion';

const REWARDS = [
  {
    id: 'r1', title: 'Coxinha cortesia', pts: 300,
    image: 'https://images.unsplash.com/photo-1625398407796-0fd2d60d5d26?w=600&h=400&fit=crop',
  },
  {
    id: 'r2', title: 'Combo Dupla com 20% off', pts: 500,
    image: 'https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?w=600&h=400&fit=crop',
  },
  {
    id: 'r3', title: '50 mini salgados grátis', pts: 1200,
    image: 'https://images.unsplash.com/photo-1625944525903-8e91e4d8ec31?w=600&h=400&fit=crop',
  },
  {
    id: 'r4', title: 'Festival gourmet (até 4 pessoas)', pts: 2500,
    image: 'https://images.unsplash.com/photo-1604326531570-2689ea7e7e02?w=600&h=400&fit=crop',
  },
];

const HISTORY = [
  { id: 'h1', when: '2 dias atrás', label: 'Pedido #A3B7', pts: +18 },
  { id: 'h2', when: '5 dias atrás', label: 'Indicou um amigo', pts: +100 },
  { id: 'h3', when: '2 semanas atrás', label: 'Resgatou "Coxinha cortesia"', pts: -300 },
  { id: 'h4', when: '3 semanas atrás', label: 'Pedido #X2M9', pts: +44 },
];

const BALANCE = 840;
const NEXT_TIER = 1000;

export default function LoyaltyPage() {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard?.writeText('FRITAFINO-MARIA2024').catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <>
      <Header title="Fidelidade" />

      {/* Card principal */}
      <section className="px-4 pt-4">
        <div className="relative bg-gradient-to-br from-brand-700 via-brand to-accent-500 rounded-3xl shadow-warm p-5 text-white overflow-hidden">
          <div className="absolute -top-8 -right-6 w-40 h-40 bg-white/10 rounded-full" />
          <div className="absolute -bottom-12 -left-8 w-40 h-40 bg-white/10 rounded-full" />
          <div className="relative">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider opacity-90">
                Nível Ouro
              </span>
              <Trophy className="w-5 h-5 text-accent-200" />
            </div>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-5xl font-display font-bold">{BALANCE}</span>
              <span className="text-sm opacity-90">pontos</span>
            </div>
            <div className="mt-3">
              <div className="flex items-center justify-between text-xs mb-1 opacity-90">
                <span>Faltam {NEXT_TIER - BALANCE} pts para o Nível Diamante</span>
                <span>{Math.round((BALANCE / NEXT_TIER) * 100)}%</span>
              </div>
              <div className="h-2 rounded-full bg-white/20 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(BALANCE / NEXT_TIER) * 100}%` }}
                  transition={{ duration: 1.2, ease: 'easeOut' }}
                  className="h-full bg-white rounded-full"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cashback */}
      <section className="px-4 mt-4">
        <div className="bg-white rounded-2xl shadow-soft p-4 flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-emerald-700" />
          </div>
          <div className="flex-1">
            <div className="text-xs text-gray-500">Cashback disponível</div>
            <div className="text-lg font-bold text-emerald-700">R$ 23,50</div>
          </div>
          <button className="h-9 px-3 bg-emerald-600 text-white text-xs font-semibold rounded-lg">
            Usar agora
          </button>
        </div>
      </section>

      {/* Recompensas */}
      <section className="px-4 mt-6">
        <h2 className="text-base font-display font-bold text-brand-900 mb-3 flex items-center gap-2">
          <Gift className="w-4 h-4" /> Troque seus pontos
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {REWARDS.map((r) => {
            const canRedeem = BALANCE >= r.pts;
            return (
              <div
                key={r.id}
                className={`bg-white rounded-2xl shadow-soft overflow-hidden ${
                  !canRedeem ? 'opacity-70' : ''
                }`}
              >
                <div
                  className="aspect-[4/3] bg-image"
                  style={{ backgroundImage: `url(${r.image})` }}
                />
                <div className="p-3">
                  <div className="text-sm font-semibold text-gray-900 mb-1 line-clamp-2 leading-tight min-h-[36px]">
                    {r.title}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-accent-700">
                      {r.pts} pts
                    </span>
                    <button
                      disabled={!canRedeem}
                      className={`text-[11px] font-bold px-2.5 py-1 rounded-lg ${
                        canRedeem
                          ? 'bg-brand text-white'
                          : 'bg-gray-200 text-gray-500'
                      }`}
                    >
                      {canRedeem ? 'Resgatar' : 'Faltam ' + (r.pts - BALANCE)}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Indicação */}
      <section className="px-4 mt-6">
        <div className="bg-accent-50 border border-accent-200 rounded-2xl p-4">
          <div className="text-sm font-bold text-accent-900 mb-1">
            Convide um amigo, ganhe 100 pts
          </div>
          <div className="text-xs text-accent-800 mb-3">
            Seu amigo ganha 10% off na primeira compra.
          </div>
          <div className="flex items-center gap-2">
            <code className="flex-1 bg-white rounded-lg px-3 py-2 text-sm font-mono text-brand-800">
              FRITAFINO-MARIA2024
            </code>
            <button
              onClick={copy}
              className="h-10 px-4 bg-accent-500 text-brand-900 text-sm font-bold rounded-lg flex items-center gap-1.5"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" /> ok
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" /> copiar
                </>
              )}
            </button>
          </div>
        </div>
      </section>

      {/* Histórico */}
      <section className="px-4 mt-6 mb-6">
        <h2 className="text-base font-display font-bold text-brand-900 mb-3">Histórico</h2>
        <div className="bg-white rounded-2xl shadow-soft divide-y divide-cream-200">
          {HISTORY.map((h) => (
            <div key={h.id} className="flex items-center gap-3 px-4 py-3">
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-900">{h.label}</div>
                <div className="text-xs text-gray-500">{h.when}</div>
              </div>
              <div
                className={`text-sm font-bold ${
                  h.pts > 0 ? 'text-emerald-700' : 'text-red-700'
                }`}
              >
                {h.pts > 0 ? '+' : ''}{h.pts}
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
