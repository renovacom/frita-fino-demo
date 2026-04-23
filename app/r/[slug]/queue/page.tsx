'use client';

import { useEffect, useState } from 'react';
import { Users, Clock, MapPin, Calendar, Check, Phone } from 'lucide-react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import { cn } from '@/lib/utils';

type Tab = 'fila' | 'reserva';

export default function QueuePage() {
  const [tab, setTab] = useState<Tab>('fila');
  const [inQueue, setInQueue] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', party: 2 });
  const [position, setPosition] = useState(4);
  const [eta, setEta] = useState(18);
  const [reservationConfirmed, setReservationConfirmed] = useState(false);

  useEffect(() => {
    if (!inQueue) return;
    const id = setInterval(() => {
      setPosition((p) => Math.max(1, p - 1));
      setEta((e) => Math.max(3, e - 3));
    }, 6000);
    return () => clearInterval(id);
  }, [inQueue]);

  return (
    <>
      <Header title="Sua conta" />

      {/* Tabs */}
      <div className="px-4 pt-4">
        <div className="grid grid-cols-2 bg-white rounded-xl p-1 shadow-soft">
          {[
            { id: 'fila', label: '⏰ Fila de espera' },
            { id: 'reserva', label: '📅 Reservar mesa' },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id as Tab)}
              className={cn(
                'h-10 rounded-lg text-sm font-semibold transition-colors',
                tab === t.id
                  ? 'bg-brand text-white shadow-warm'
                  : 'text-gray-600 hover:text-brand-700'
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {tab === 'fila' && (
        <section className="px-4 pt-5">
          {!inQueue ? (
            <>
              <div className="bg-white rounded-2xl shadow-soft p-5 mb-4">
                <h2 className="text-lg font-display font-bold text-brand-900 mb-1">
                  Entre na fila sem sair do lugar
                </h2>
                <p className="text-sm text-gray-600 mb-4">
                  Avisaremos por WhatsApp quando sua mesa estiver pronta.
                </p>

                <div className="flex items-center gap-2 text-xs text-gray-500 mb-4 pb-4 border-b border-cream-200">
                  <Users className="w-4 h-4 text-brand-600" />
                  <span>Fila atual: <strong className="text-brand-800">12 pessoas</strong></span>
                  <span>·</span>
                  <Clock className="w-4 h-4 text-brand-600" />
                  <span>Espera média: <strong className="text-brand-800">~25 min</strong></span>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-medium text-gray-700">Seu nome</label>
                    <input
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="Ex.: Maria Silva"
                      className="w-full mt-1 h-11 px-3 rounded-xl border border-cream-200 bg-cream-50 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-700">Celular (WhatsApp)</label>
                    <input
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder="(11) 99999-9999"
                      className="w-full mt-1 h-11 px-3 rounded-xl border border-cream-200 bg-cream-50 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-700">Quantas pessoas?</label>
                    <div className="mt-1 flex gap-2">
                      {[1, 2, 3, 4, 6, 8].map((n) => (
                        <button
                          key={n}
                          onClick={() => setForm({ ...form, party: n })}
                          className={cn(
                            'flex-1 h-10 rounded-lg text-sm font-semibold border-2 transition-colors',
                            form.party === n
                              ? 'bg-brand text-white border-brand'
                              : 'bg-white text-gray-700 border-cream-200'
                          )}
                        >
                          {n === 8 ? '8+' : n}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setInQueue(true)}
                disabled={!form.name || !form.phone}
                className={cn(
                  'w-full h-13 py-3.5 rounded-2xl font-bold text-base shadow-warm',
                  form.name && form.phone
                    ? 'bg-brand text-white hover:bg-brand-700'
                    : 'bg-gray-300 text-white'
                )}
              >
                Entrar na fila
              </button>
            </>
          ) : (
            <div className="space-y-4">
              {/* Status */}
              <div className="bg-gradient-to-br from-brand-700 to-brand rounded-3xl shadow-warm p-6 text-white text-center">
                <div className="text-xs opacity-90 uppercase tracking-wider">Sua posição</div>
                <motion.div
                  key={position}
                  initial={{ scale: 1.3, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-7xl font-display font-bold leading-none my-2"
                >
                  {position}º
                </motion.div>
                <div className="text-sm opacity-90">
                  Tempo estimado: <strong>{eta} min</strong>
                </div>
                {position === 1 && (
                  <div className="mt-3 py-2 px-4 bg-accent text-brand-900 rounded-xl font-bold">
                    🎉 Você é o próximo!
                  </div>
                )}
              </div>

              <div className="bg-white rounded-2xl shadow-soft p-4">
                <div className="flex items-center gap-3 py-2">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                    <Phone className="w-4 h-4 text-emerald-700" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-brand-900">
                      Notificações ligadas
                    </div>
                    <div className="text-xs text-gray-500">
                      Vamos mandar WhatsApp quando faltar 1 posição
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setInQueue(false)}
                className="w-full h-12 rounded-2xl bg-white border-2 border-red-300 text-red-700 font-semibold"
              >
                Sair da fila
              </button>
            </div>
          )}
        </section>
      )}

      {tab === 'reserva' && (
        <section className="px-4 pt-5">
          {!reservationConfirmed ? (
            <div className="bg-white rounded-2xl shadow-soft p-5 space-y-4">
              <div>
                <h2 className="text-lg font-display font-bold text-brand-900">
                  Reserve sua mesa
                </h2>
                <p className="text-sm text-gray-600">
                  Confirmação automática por WhatsApp em até 30 min.
                </p>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-700 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" /> Quando?
                </label>
                <div className="mt-2 flex gap-2 overflow-x-auto no-scrollbar pb-1 -mx-1 px-1">
                  {['Sex 24', 'Sáb 25', 'Dom 26', 'Seg 27', 'Ter 28', 'Qua 29', 'Qui 30'].map(
                    (d, i) => (
                      <button
                        key={d}
                        className={cn(
                          'shrink-0 flex flex-col items-center justify-center w-14 h-16 rounded-xl border-2 text-xs font-medium',
                          i === 1
                            ? 'bg-brand text-white border-brand shadow-warm'
                            : 'bg-white text-gray-700 border-cream-200'
                        )}
                      >
                        <span className="text-[10px] opacity-80">{d.split(' ')[0]}</span>
                        <span className="text-lg font-bold">{d.split(' ')[1]}</span>
                      </button>
                    )
                  )}
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-700 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" /> Horário
                </label>
                <div className="mt-2 grid grid-cols-4 gap-2">
                  {['19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00', '22:30'].map(
                    (t, i) => (
                      <button
                        key={t}
                        disabled={i === 2 || i === 5}
                        className={cn(
                          'h-10 rounded-lg text-sm font-semibold border-2',
                          i === 3
                            ? 'bg-brand text-white border-brand shadow-warm'
                            : i === 2 || i === 5
                            ? 'bg-cream-100 text-gray-400 border-cream-200 line-through'
                            : 'bg-white text-gray-700 border-cream-200'
                        )}
                      >
                        {t}
                      </button>
                    )
                  )}
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-700">Quantas pessoas?</label>
                <div className="mt-2 flex gap-2">
                  {[2, 3, 4, 6, 8].map((n) => (
                    <button
                      key={n}
                      className={cn(
                        'flex-1 h-10 rounded-lg text-sm font-semibold border-2',
                        n === 4
                          ? 'bg-brand text-white border-brand'
                          : 'bg-white text-gray-700 border-cream-200'
                      )}
                    >
                      {n === 8 ? '8+' : n}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-700">Ocasião (opcional)</label>
                <div className="mt-2 flex gap-2 flex-wrap">
                  {['🎂 Aniversário', '💼 Reunião', '❤️ Romântico', '👨‍👩‍👧 Família'].map((o) => (
                    <button
                      key={o}
                      className="h-9 px-3 rounded-full text-xs font-medium bg-white border border-cream-200 text-gray-700"
                    >
                      {o}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setReservationConfirmed(true)}
                className="w-full h-12 rounded-2xl bg-brand hover:bg-brand-700 text-white font-bold shadow-warm"
              >
                Confirmar reserva
              </button>

              <p className="text-[11px] text-gray-500 text-center pt-1">
                <MapPin className="w-3 h-3 inline mr-1" />
                Av. Paulista, 2100 — Bela Vista
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-white rounded-2xl shadow-soft p-6 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', damping: 12 }}
                  className="w-16 h-16 mx-auto mb-3 rounded-full bg-emerald-500 text-white flex items-center justify-center"
                >
                  <Check className="w-8 h-8 stroke-[3]" />
                </motion.div>
                <h2 className="text-xl font-display font-bold text-brand-900">
                  Reserva confirmada!
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Sábado, 25 · 20:30 · 4 pessoas
                </p>
                <div className="mt-4 pt-4 border-t border-cream-200 text-left space-y-2 text-xs text-gray-600">
                  <div>📱 Confirmação enviada para seu WhatsApp</div>
                  <div>🗓️ Adicionado automaticamente ao calendário</div>
                  <div>✨ Você recebe um lembrete 2h antes</div>
                </div>
              </div>
              <button
                onClick={() => setReservationConfirmed(false)}
                className="w-full h-12 rounded-2xl bg-white border-2 border-cream-200 text-gray-700 font-semibold"
              >
                Fazer nova reserva
              </button>
            </div>
          )}
        </section>
      )}
    </>
  );
}
