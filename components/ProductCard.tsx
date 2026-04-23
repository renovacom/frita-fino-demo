'use client';

import Link from 'next/link';
import { Plus, Star } from 'lucide-react';
import type { Product } from '@/lib/types';
import { RESTAURANT } from '@/lib/mock-data';
import { formatBRL, cn } from '@/lib/utils';
import { useCart } from '@/lib/cart-store';
import { motion } from 'framer-motion';

interface Props {
  product: Product;
  compact?: boolean;
}

export default function ProductCard({ product, compact }: Props) {
  const addItem = useCart((s) => s.addItem);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!product.available) return;
    // Se tem modificadores, vai para detalhe; senão adiciona direto
    if (product.modifierGroups && product.modifierGroups.length) {
      window.location.href = `/r/${RESTAURANT.slug}/product/${product.id}`;
      return;
    }
    addItem({
      productId: product.id,
      name: product.name,
      image: product.image,
      unitPrice: product.price,
      quantity: 1,
      modifiers: [],
    });
  };

  const discountedPrice = product.discountPct
    ? product.price * (1 - product.discountPct / 100)
    : product.price;

  return (
    <Link
      href={`/r/${RESTAURANT.slug}/product/${product.id}`}
      className={cn(
        'group block rounded-2xl bg-white shadow-soft hover:shadow-hover transition-all overflow-hidden',
        !product.available && 'opacity-60 pointer-events-none'
      )}
    >
      <div className={cn('relative w-full', compact ? 'aspect-[4/3]' : 'aspect-[16/10]')}>
        <div
          className="absolute inset-0 bg-image"
          style={{ backgroundImage: `url(${product.image})` }}
        />
        {!product.available && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="bg-white text-brand-800 font-semibold text-xs px-3 py-1 rounded-full">
              Esgotado hoje
            </span>
          </div>
        )}
        {product.discountPct && (
          <span className="absolute top-2 left-2 bg-accent text-brand-900 text-[11px] font-bold px-2 py-0.5 rounded-full shadow-soft">
            -{product.discountPct}%
          </span>
        )}
        {product.tags.includes('assinatura') && (
          <span className="absolute top-2 right-2 bg-brand text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
            Assinatura
          </span>
        )}
        {product.tags.includes('vegano') && (
          <span className="absolute bottom-2 left-2 bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
            Vegano
          </span>
        )}

        {product.available && (
          <motion.button
            onClick={handleQuickAdd}
            whileTap={{ scale: 0.9 }}
            className="absolute bottom-2 right-2 w-11 h-11 rounded-full bg-brand text-white shadow-warm flex items-center justify-center hover:bg-brand-700 transition-colors"
            aria-label="Adicionar ao carrinho"
          >
            <Plus className="w-6 h-6" />
          </motion.button>
        )}
      </div>

      <div className="p-3">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="text-sm font-semibold text-gray-900 line-clamp-1 leading-tight">
            {product.name}
          </h3>
          {product.rating && (
            <div className="shrink-0 flex items-center gap-0.5 text-amber-500 text-xs font-medium">
              <Star className="w-3.5 h-3.5 fill-current" />
              {product.rating.toFixed(1)}
            </div>
          )}
        </div>
        <p className="text-xs text-gray-500 line-clamp-2 leading-snug mb-2 min-h-[32px]">
          {product.description}
        </p>
        <div className="flex items-baseline gap-1.5">
          <span className="text-base font-bold text-brand-800">
            {formatBRL(discountedPrice)}
          </span>
          {product.discountPct && (
            <span className="text-xs text-gray-400 line-through">
              {formatBRL(product.price)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
