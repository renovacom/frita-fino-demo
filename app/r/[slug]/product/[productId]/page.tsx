'use client';

import { useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Minus, Plus, Star, Clock, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import { getProduct, RESTAURANT } from '@/lib/mock-data';
import { formatBRL, cn } from '@/lib/utils';
import { useCart } from '@/lib/cart-store';
import type { ModifierGroup, ModifierOption } from '@/lib/types';

export default function ProductDetail() {
  const { productId } = useParams<{ productId: string }>();
  const router = useRouter();
  const product = getProduct(productId);
  const addItem = useCart((s) => s.addItem);

  const [quantity, setQuantity] = useState(1);
  const [selections, setSelections] = useState<Record<string, string[]>>({});
  const [notes, setNotes] = useState('');

  if (!product) {
    return (
      <>
        <Header title="Produto" showBack />
        <div className="p-8 text-center text-gray-500">Produto não encontrado.</div>
      </>
    );
  }

  const togglePick = (group: ModifierGroup, opt: ModifierOption) => {
    setSelections((s) => {
      const current = s[group.id] ?? [];
      if (group.type === 'single') return { ...s, [group.id]: [opt.id] };
      if (current.includes(opt.id)) {
        return { ...s, [group.id]: current.filter((x) => x !== opt.id) };
      }
      if (current.length >= group.max) return s;
      return { ...s, [group.id]: [...current, opt.id] };
    });
  };

  const modDelta = useMemo(() => {
    let delta = 0;
    for (const g of product.modifierGroups ?? []) {
      const picks = selections[g.id] ?? [];
      for (const oid of picks) {
        const opt = g.options.find((o) => o.id === oid);
        if (opt) delta += opt.priceDelta;
      }
    }
    return delta;
  }, [product.modifierGroups, selections]);

  const unitPrice = product.price + modDelta;
  const totalPrice = unitPrice * quantity;

  // Validação: todos modifier groups com min >= 1 precisam de seleção
  const missingRequired = (product.modifierGroups ?? []).some((g) => {
    const picks = selections[g.id] ?? [];
    return picks.length < g.min;
  });

  const handleAdd = () => {
    const mods: { groupName: string; optionName: string; priceDelta: number }[] = [];
    for (const g of product.modifierGroups ?? []) {
      for (const oid of selections[g.id] ?? []) {
        const opt = g.options.find((o) => o.id === oid);
        if (opt) mods.push({ groupName: g.name, optionName: opt.name, priceDelta: opt.priceDelta });
      }
    }
    addItem({
      productId: product.id,
      name: product.name,
      image: product.image,
      unitPrice: product.price,
      quantity,
      modifiers: mods,
      notes: notes || undefined,
    });
    router.push(`/r/${RESTAURANT.slug}/cart`);
  };

  return (
    <div className="pb-32">
      {/* Imagem hero */}
      <div className="relative h-72">
        <div className="absolute inset-0 bg-image" style={{ backgroundImage: `url(${product.image})` }} />
        <div className="absolute inset-0 bg-gradient-to-t from-cream-50 via-transparent to-black/20" />
        <div className="absolute top-0 inset-x-0">
          <Header showBack variant="transparent" />
        </div>
      </div>

      {/* Conteúdo */}
      <div className="-mt-6 rounded-t-3xl bg-cream-50 relative z-10 px-5 pt-6">
        <div className="flex items-start justify-between gap-3 mb-2">
          <h1 className="text-2xl font-display font-bold text-brand-900 leading-tight">
            {product.name}
          </h1>
          <div className="shrink-0 flex items-center gap-1 text-amber-500 text-sm font-semibold">
            <Star className="w-4 h-4 fill-current" />
            <span className="text-gray-900">{product.rating.toFixed(1)}</span>
            <span className="text-gray-400 font-normal text-xs">
              ({product.ratingCount})
            </span>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {product.tags.map((t) => (
            <span
              key={t}
              className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-white border border-cream-200 text-gray-700 capitalize"
            >
              {t.replace('-', ' ')}
            </span>
          ))}
          <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-white border border-cream-200 text-gray-700 inline-flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {product.prepTimeMin} min
          </span>
        </div>

        <p className="text-sm text-gray-700 leading-relaxed mb-4">{product.description}</p>

        {/* Alergênicos */}
        {product.allergens.length > 0 && (
          <div className="rounded-xl bg-amber-50 border border-amber-200 p-3 mb-5 flex gap-2 text-xs">
            <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-px" />
            <div>
              <span className="font-semibold text-amber-900">Contém: </span>
              <span className="text-amber-900 capitalize">{product.allergens.join(', ')}</span>
            </div>
          </div>
        )}

        {/* Modifiers */}
        {product.modifierGroups?.map((group) => (
          <div key={group.id} className="mb-5">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-brand-900">
                {group.name}
                {group.min > 0 && <span className="text-brand-600 ml-1">*</span>}
              </h3>
              <span className="text-[11px] text-gray-500">
                {group.type === 'single'
                  ? 'Escolha 1'
                  : `Escolha até ${group.max}`}
              </span>
            </div>
            <div className="space-y-2">
              {group.options.map((opt) => {
                const active = (selections[group.id] ?? []).includes(opt.id);
                return (
                  <button
                    key={opt.id}
                    onClick={() => togglePick(group, opt)}
                    className={cn(
                      'w-full flex items-center justify-between px-4 py-3 rounded-xl border-2 transition-colors text-left',
                      active
                        ? 'bg-brand/5 border-brand text-brand-900'
                        : 'bg-white border-cream-200 hover:border-brand-300'
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={cn(
                          'w-5 h-5 flex items-center justify-center shrink-0',
                          group.type === 'single'
                            ? 'rounded-full border-2'
                            : 'rounded-md border-2',
                          active ? 'border-brand bg-brand' : 'border-gray-300'
                        )}
                      >
                        {active && (
                          <span
                            className={cn(
                              group.type === 'single'
                                ? 'w-2 h-2 rounded-full bg-white'
                                : 'text-white text-xs'
                            )}
                          >
                            {group.type !== 'single' && '✓'}
                          </span>
                        )}
                      </span>
                      <span className="text-sm font-medium">{opt.name}</span>
                    </div>
                    {opt.priceDelta !== 0 && (
                      <span
                        className={cn(
                          'text-sm font-semibold',
                          opt.priceDelta > 0 ? 'text-brand-700' : 'text-emerald-700'
                        )}
                      >
                        {opt.priceDelta > 0 ? '+' : '−'}
                        {formatBRL(Math.abs(opt.priceDelta))}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}

        {/* Observações */}
        <div className="mb-5">
          <h3 className="text-sm font-bold text-brand-900 mb-2">Alguma observação?</h3>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder='Ex.: "sem cebola", "bem frito", "a coxinha crocante"'
            rows={2}
            className="w-full rounded-xl border border-cream-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300"
          />
        </div>
      </div>

      {/* Barra fixa de ação */}
      <div className="fixed bottom-[76px] inset-x-0 z-30 px-4 pb-3">
        <div className="max-w-screen-sm mx-auto bg-white rounded-2xl shadow-warm border border-cream-200 p-3 flex items-center gap-3">
          <div className="flex items-center bg-cream-100 rounded-xl">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="w-10 h-10 flex items-center justify-center text-brand-800 disabled:opacity-50"
              disabled={quantity === 1}
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-8 text-center font-semibold">{quantity}</span>
            <button
              onClick={() => setQuantity((q) => q + 1)}
              className="w-10 h-10 flex items-center justify-center text-brand-800"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleAdd}
            disabled={missingRequired}
            className={cn(
              'flex-1 h-12 rounded-xl font-bold text-white flex items-center justify-center gap-2 transition-colors',
              missingRequired ? 'bg-gray-300' : 'bg-brand hover:bg-brand-700 shadow-warm'
            )}
          >
            <span>Adicionar</span>
            <span className="opacity-90">·</span>
            <span>{formatBRL(totalPrice)}</span>
          </motion.button>
        </div>
      </div>
    </div>
  );
}
