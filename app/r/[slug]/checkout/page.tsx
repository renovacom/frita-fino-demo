'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Check, Copy, CreditCard, Lock, Smartphone, Wallet } from 'lucide-react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import { useCart } from '@/lib/cart-store';
import { RESTAURANT } from '@/lib/mock-data';
import { formatBRL, cn, orderNumber } from '@/lib/utils';

type Method = 'pix' | 'card' | 'wallet' | 'counter';

export default function CheckoutPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [method, setMethod] = useState<Method>('pix');
  const [copied, setCopied] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5min

  useEffect(() => setMounted(true), []);

  const items = useCart((s) => s.items);
  const clear = useCart((s) => s.clear);

  const subtotal = items.reduce(
    (acc, it) =>
      acc +
      (it.unitPrice + it.modifiers.reduce((a, m) => a + m.priceDelta, 0)) * it.quantity,
    0
  );
  const service = subtotal * (RESTAURANT.serviceFeePct / 100);
  const total = subtotal + service;

  // Timer PIX
  useEffect(() => {
    if (method !== 'pix') return;
    setTimeLeft(300);
    const id = setInterval(() => setTimeLeft((t) => Math.max(0, t - 1)), 1000);
    return () => clearInterval(id);
  }, [method]);

  const pixCode = useMemo(
    () =>
      '00020126580014br.gov.bcb.pix0136fritaefino-pix-' +
      Math.random().toString(36).slice(2, 10) +
      '5204000053039865405' +
      total.toFixed(2).replace('.', '') +
      '5802BR5913FRITA E FINO6009SAO PAULO62070503***6304A2BC',
    [total]
  );

  const copyCode = () => {
    navigator.clipboard?.writeText(pixCode).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleConfirm = () => {
    if (items.length === 0) return;
    setProcessing(true);
    // Simula PSP
    setTimeout(() => {
      const num = orderNumber();
      clear();
      router.push(`/r/${RESTAURANT.slug}/order?n=${num}`);
    }, 1800);
  };

  if (!mounted) return <Header title="Pagamento" showBack />;

  const fmt = (s: number) =>
    `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  return (
    <>
      <Header title="Pagamento" showBack />

      <div className="px-4 py-4 pb-[140px]">
        {/* Resumo compacto */}
        <details className="bg-white rounded-2xl shadow-soft p-4 mb-4 group">
          <summary className="flex items-center justify-between cursor-pointer list-none">
            <div className="text-sm font-bold text-brand-900">Resumo do pedido</div>
            <div className="text-base font-bold text-brand-800">{formatBRL(total)}</div>
          </summary>
          <div className="mt-3 space-y-1.5 text-sm text-gray-700">
            {items.map((it) => (
              <div key={it.lineId} className="flex justify-between">
                <span>
                  {it.quantity}× {it.name}
                </span>
                <span>
                  {formatBRL(
                    (it.unitPrice + it.modifiers.reduce((a, m) => a + m.priceDelta, 0)) *
                      it.quantity
                  )}
                </span>
              </div>
            ))}
            <div className="flex justify-between pt-2 border-t border-cream-200">
              <span>Taxa de serviço</span>
              <span>{formatBRL(service)}</span>
            </div>
          </div>
        </details>

        {/* Tabs de método */}
        <div className="flex gap-2 mb-4 overflow-x-auto no-scrollbar">
          {[
            { id: 'pix', label: 'PIX', icon: Smartphone, highlight: true },
            { id: 'card', label: 'Cartão', icon: CreditCard },
            { id: 'wallet', label: 'Carteira', icon: Wallet },
            { id: 'counter', label: 'Caixa', icon: Lock },
          ].map((m) => {
            const Icon = m.icon;
            const active = method === (m.id as Method);
            return (
              <button
                key={m.id}
                onClick={() => setMethod(m.id as Method)}
                className={cn(
                  'flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 font-semibold text-sm shrink-0 transition-colors',
                  active
                    ? 'bg-brand text-white border-brand shadow-warm'
                    : 'bg-white text-gray-700 border-cream-200 hover:border-brand-300'
                )}
              >
                <Icon className="w-4 h-4" />
                {m.label}
                {(m.highlight ?? false) && !active && (
                  <span className="text-[10px] font-bold bg-accent text-brand-900 px-1.5 py-0.5 rounded-full">
                    rápido
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* PIX */}
        {method === 'pix' && (
          <motion.section
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-soft p-5"
          >
            <div className="text-center">
              <h2 className="text-lg font-display font-bold text-brand-900 mb-1">
                Pague em segundos via PIX
              </h2>
              <p className="text-xs text-gray-500 mb-4">
                Aponte a câmera do seu banco para o QR Code abaixo
              </p>

              {/* Mock QR Code visual (SVG checkered) */}
              <div className="inline-block bg-white p-3 rounded-2xl border-2 border-cream-200">
                <div className="relative">
                  <div className="grid grid-cols-21 gap-0" style={{ width: 210, height: 210 }}>
                    {Array.from({ length: 441 }).map((_, i) => {
                      // Cria padrão pseudo-aleatório mas determinístico
                      const row = Math.floor(i / 21);
                      const col = i % 21;
                      const corner =
                        (row < 7 && col < 7) ||
                        (row < 7 && col > 13) ||
                        (row > 13 && col < 7);
                      const outerCorner = corner && (row === 0 || row === 6 || col === 0 || col === 6 || row === 14 || col === 14 || row === 20 || col === 20);
                      const innerCorner = corner && (row >= 2 && row <= 4 && col >= 2 && col <= 4) || (corner && row >= 2 && row <= 4 && col >= 16 && col <= 18) || (corner && row >= 16 && row <= 18 && col >= 2 && col <= 4);
                      let black = false;
                      if (corner) {
                        black = outerCorner || innerCorner;
                      } else {
                        black = ((i * 7919 + 13) % 3) === 0;
                      }
                      return (
                        <div
                          key={i}
                          style={{ width: 10, height: 10 }}
                          className={black ? 'bg-brand-900' : 'bg-white'}
                        />
                      );
                    })}
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 bg-white p-2 rounded-xl shadow">
                      <div className="w-full h-full bg-brand rounded-md flex items-center justify-center text-white text-xl font-bold font-display">
                        F
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-center gap-2 text-xs">
                <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse-soft" />
                <span className="text-gray-600 font-medium">
                  Aguardando pagamento · expira em{' '}
                  <span className="font-bold text-brand-800">{fmt(timeLeft)}</span>
                </span>
              </div>

              <div className="mt-4 p-3 bg-cream-50 rounded-xl border border-cream-200">
                <p className="text-[11px] text-gray-500 mb-1">PIX copia-e-cola</p>
                <code className="block text-[10px] text-gray-700 font-mono truncate">
                  {pixCode}
                </code>
                <button
                  onClick={copyCode}
                  className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-brand-700 hover:text-brand-900"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5" /> Código copiado!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" /> Copiar código PIX
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.section>
        )}

        {/* Cartão */}
        {method === 'card' && (
          <motion.section
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-soft p-5 space-y-3"
          >
            <h2 className="text-sm font-bold text-brand-900">Dados do cartão</h2>
            <div>
              <label className="text-xs font-medium text-gray-600">Número</label>
              <input
                placeholder="0000 0000 0000 0000"
                className="w-full mt-1 h-11 px-3 rounded-xl border border-cream-200 bg-cream-50 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-gray-600">Validade</label>
                <input
                  placeholder="MM/AA"
                  className="w-full mt-1 h-11 px-3 rounded-xl border border-cream-200 bg-cream-50 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600">CVV</label>
                <input
                  placeholder="123"
                  className="w-full mt-1 h-11 px-3 rounded-xl border border-cream-200 bg-cream-50 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300"
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600">Nome impresso no cartão</label>
              <input
                placeholder="JOAO M SILVA"
                className="w-full mt-1 h-11 px-3 rounded-xl border border-cream-200 bg-cream-50 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300 uppercase"
              />
            </div>
            <label className="flex items-center gap-2 text-xs text-gray-600">
              <input type="checkbox" className="accent-brand" defaultChecked />
              Salvar este cartão de forma segura para próximos pedidos
            </label>
            <div className="flex items-center gap-1.5 text-[11px] text-gray-500 pt-2">
              <Lock className="w-3.5 h-3.5" />
              Pagamento processado por PSP certificado PCI DSS
            </div>
          </motion.section>
        )}

        {/* Carteira */}
        {method === 'wallet' && (
          <section className="bg-white rounded-2xl shadow-soft p-5 space-y-3">
            <h2 className="text-sm font-bold text-brand-900">Pagar com carteira digital</h2>
            <button className="w-full h-14 bg-black text-white rounded-xl font-semibold flex items-center justify-center gap-2">
               Pay
            </button>
            <button className="w-full h-14 bg-white border-2 border-gray-200 rounded-xl font-semibold flex items-center justify-center gap-2">
              🅶 Pay
            </button>
          </section>
        )}

        {/* Pagar no caixa */}
        {method === 'counter' && (
          <section className="bg-white rounded-2xl shadow-soft p-5">
            <h2 className="text-sm font-bold text-brand-900 mb-2">Pagar no caixa</h2>
            <p className="text-sm text-gray-600">
              Seu pedido será enviado para a cozinha agora. Ao terminar, basta ir ao caixa e mostrar
              o número do seu pedido para finalizar o pagamento.
            </p>
          </section>
        )}

        <label className="flex items-start gap-2 text-xs text-gray-600 mt-4">
          <input type="checkbox" className="accent-brand mt-0.5" defaultChecked />
          <span>
            Aceito os <a className="text-brand-700 underline">termos</a> e a{' '}
            <a className="text-brand-700 underline">política de privacidade</a>.
          </span>
        </label>
      </div>

      {/* CTA fixo */}
      <div className="fixed bottom-[76px] inset-x-0 z-30 px-4 pb-3">
        <div className="max-w-screen-sm mx-auto">
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={handleConfirm}
            disabled={processing || items.length === 0}
            className={cn(
              'w-full h-14 rounded-2xl font-bold flex items-center justify-center gap-2 text-base shadow-warm transition-colors',
              processing ? 'bg-gray-400 text-white' : 'bg-brand hover:bg-brand-700 text-white'
            )}
          >
            {processing ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Processando…
              </>
            ) : (
              <>
                Pagar {formatBRL(total)}
              </>
            )}
          </motion.button>
        </div>
      </div>
    </>
  );
}
