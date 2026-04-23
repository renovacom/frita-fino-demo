'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Languages, Search, User } from 'lucide-react';
import { RESTAURANT } from '@/lib/mock-data';
import { cn } from '@/lib/utils';

interface HeaderProps {
  title?: string;
  showBack?: boolean;
  mesa?: string | null;
  variant?: 'transparent' | 'solid';
  onSearch?: () => void;
}

export default function Header({ title, showBack, mesa, variant = 'solid', onSearch }: HeaderProps) {
  const router = useRouter();
  return (
    <header
      className={cn(
        'sticky top-0 z-40 flex items-center gap-3 px-4 py-3 transition-colors',
        variant === 'solid'
          ? 'bg-white/90 backdrop-blur-md border-b border-cream-200'
          : 'bg-transparent'
      )}
    >
      {showBack ? (
        <button
          onClick={() => router.back()}
          className="w-10 h-10 rounded-full flex items-center justify-center bg-white/80 shadow-soft hover:bg-cream-100 transition-colors"
          aria-label="Voltar"
        >
          <ChevronLeft className="w-5 h-5 text-brand-700" />
        </button>
      ) : (
        <Link href={`/r/${RESTAURANT.slug}`} className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-brand flex items-center justify-center text-white text-xl font-display font-bold shadow-warm">
            F
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-bold text-brand-800">{RESTAURANT.name}</span>
            {mesa && (
              <span className="text-xs text-brand-600">Mesa {mesa}</span>
            )}
          </div>
        </Link>
      )}
      <div className="flex-1 text-center">
        {title && <h1 className="text-base font-semibold text-brand-800 truncate">{title}</h1>}
      </div>
      <div className="flex items-center gap-1">
        {onSearch && (
          <button
            onClick={onSearch}
            className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-cream-100 transition-colors"
            aria-label="Buscar"
          >
            <Search className="w-5 h-5 text-brand-700" />
          </button>
        )}
        <button
          className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-cream-100 transition-colors"
          aria-label="Idioma"
        >
          <Languages className="w-5 h-5 text-brand-700" />
        </button>
      </div>
    </header>
  );
}
