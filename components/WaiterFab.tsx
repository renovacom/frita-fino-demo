'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { BellRing, X } from 'lucide-react';

const OPTIONS = [
  { id: 'agua', icon: '💧', label: 'Água' },
  { id: 'guardanapo', icon: '🧻', label: 'Guardanapo' },
  { id: 'talher', icon: '🍴', label: 'Talher' },
  { id: 'duvida', icon: '❓', label: 'Tirar dúvida' },
  { id: 'conta', icon: '🧾', label: 'Pedir a conta' },
];

export default function WaiterFab() {
  const [open, setOpen] = useState(false);
  const [called, setCalled] = useState<string | null>(null);

  const call = (id: string, label: string) => {
    setCalled(label);
    setOpen(false);
    setTimeout(() => setCalled(null), 4500);
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-[160px] right-4 z-30 w-12 h-12 rounded-full bg-white shadow-warm border border-cream-200 flex items-center justify-center hover:bg-cream-50 transition-colors"
        aria-label="Chamar garçom"
      >
        <BellRing className="w-5 h-5 text-brand-700" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-end justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          >
            <motion.div
              className="w-full max-w-screen-sm bg-white rounded-t-3xl p-5 pb-8"
              initial={{ y: 400 }}
              animate={{ y: 0 }}
              exit={{ y: 400 }}
              transition={{ type: 'spring', damping: 26, stiffness: 240 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-brand-800">O que você precisa?</h2>
                <button
                  onClick={() => setOpen(false)}
                  className="w-9 h-9 rounded-full bg-cream-100 flex items-center justify-center"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {OPTIONS.map((o) => (
                  <button
                    key={o.id}
                    onClick={() => call(o.id, o.label)}
                    className="flex flex-col items-center gap-1 py-4 rounded-2xl border border-cream-200 hover:border-brand-300 hover:bg-cream-50 transition-colors"
                  >
                    <span className="text-3xl">{o.icon}</span>
                    <span className="text-xs font-medium text-gray-700">{o.label}</span>
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-500 text-center mt-4">
                O garçom recebe o chamado instantaneamente no painel e nos fones de ouvido.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {called && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            className="fixed top-20 inset-x-0 z-50 px-4 pointer-events-none"
          >
            <div className="max-w-screen-sm mx-auto bg-emerald-600 text-white px-4 py-3 rounded-2xl shadow-warm flex items-center gap-3">
              <span className="text-2xl">✅</span>
              <div className="flex-1">
                <div className="font-semibold text-sm">Chamado enviado!</div>
                <div className="text-xs opacity-90">{called} — garçom a caminho em ~2 min</div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
