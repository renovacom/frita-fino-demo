import { Star, MapPin, Clock } from 'lucide-react';
import Link from 'next/link';
import Header from '@/components/Header';
import CategoryChips from '@/components/CategoryChips';
import ProductCard from '@/components/ProductCard';
import {
  RESTAURANT,
  CATEGORIES,
  featuredProducts,
  popularProducts,
  productsByCategory,
} from '@/lib/mock-data';

interface Props {
  searchParams: { mesa?: string };
}

export default function MenuHome({ searchParams }: Props) {
  const mesa = searchParams.mesa ?? null;
  const featured = featuredProducts();
  const popular = popularProducts();

  return (
    <>
      <Header mesa={mesa} />

      {/* Hero com cover do restaurante */}
      <section className="relative h-56 -mb-10 overflow-hidden">
        <div
          className="absolute inset-0 bg-image"
          style={{ backgroundImage: `url(${RESTAURANT.cover})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/30 to-cream-50" />

        <div className="relative h-full flex flex-col justify-end px-4 pb-12">
          <h1 className="text-3xl font-display font-bold text-white drop-shadow-lg">
            {RESTAURANT.name}
          </h1>
          <p className="text-sm text-white/95 drop-shadow-md">{RESTAURANT.tagline}</p>
        </div>
      </section>

      {/* Card de informações */}
      <section className="relative z-10 mx-4 -mt-6 mb-4 bg-white rounded-2xl shadow-card p-4">
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1 text-amber-500">
            <Star className="w-4 h-4 fill-current" />
            <span className="font-bold text-gray-900 text-sm">{RESTAURANT.rating}</span>
            <span className="text-gray-500">({RESTAURANT.ratingCount.toLocaleString('pt-BR')})</span>
          </div>
          <span className="w-px h-4 bg-cream-200" />
          <div className="flex items-center gap-1 text-gray-600">
            <Clock className="w-3.5 h-3.5" />
            <span className="font-medium">Aberto agora</span>
          </div>
          <span className="w-px h-4 bg-cream-200" />
          <div className="flex items-center gap-1 text-gray-600 flex-1 truncate">
            <MapPin className="w-3.5 h-3.5" />
            <span className="truncate">{RESTAURANT.address.split('—')[0]}</span>
          </div>
        </div>
        {mesa && (
          <div className="mt-3 pt-3 border-t border-cream-200 flex items-center justify-between">
            <span className="text-xs text-gray-500">Você está na</span>
            <span className="px-3 py-1 bg-brand/10 text-brand-800 text-sm font-bold rounded-full">
              Mesa {mesa}
            </span>
          </div>
        )}
      </section>

      {/* Categorias horizontais */}
      <CategoryChips categories={CATEGORIES} />

      {/* Destaques / Featured */}
      <section className="px-4 pt-6 pb-2">
        <div className="flex items-baseline justify-between mb-3">
          <h2 className="text-xl font-display font-bold text-brand-800">
            ⭐ Sabores da casa
          </h2>
          <Link href={`/r/${RESTAURANT.slug}/category/c_destaques`} className="text-xs font-semibold text-brand-600">
            ver tudo →
          </Link>
        </div>
        <div className="flex gap-3 overflow-x-auto no-scrollbar -mx-4 px-4 pb-2">
          {featured.map((p) => (
            <div key={p.id} className="w-[260px] shrink-0">
              <ProductCard product={p} compact />
            </div>
          ))}
        </div>
      </section>

      {/* Mais pedidos */}
      <section className="px-4 pt-6 pb-2">
        <h2 className="text-xl font-display font-bold text-brand-800 mb-3">🔥 Mais pedidos de hoje</h2>
        <div className="grid grid-cols-2 gap-3">
          {popular.slice(0, 4).map((p) => (
            <ProductCard key={p.id} product={p} compact />
          ))}
        </div>
      </section>

      {/* Seções por categoria (primeiras 3) */}
      {CATEGORIES.slice(1, 4).map((cat) => {
        const items = productsByCategory(cat.id).slice(0, 4);
        if (!items.length) return null;
        return (
          <section key={cat.id} className="px-4 pt-6 pb-2">
            <div className="flex items-baseline justify-between mb-3">
              <h2 className="text-xl font-display font-bold text-brand-800 flex items-center gap-2">
                <span>{cat.icon}</span> {cat.name}
              </h2>
              <Link href={`/r/${RESTAURANT.slug}/category/${cat.id}`} className="text-xs font-semibold text-brand-600">
                ver tudo →
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {items.map((p) => (
                <ProductCard key={p.id} product={p} compact />
              ))}
            </div>
          </section>
        );
      })}

      <section className="px-4 pt-6 pb-4 text-center">
        <p className="text-xs text-gray-400">
          Cardápio atualizado em tempo real · Preços podem variar conforme disponibilidade
        </p>
      </section>
    </>
  );
}
