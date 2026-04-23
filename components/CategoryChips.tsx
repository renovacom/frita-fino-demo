'use client';

import Link from 'next/link';
import { RESTAURANT } from '@/lib/mock-data';
import type { Category } from '@/lib/types';
import { cn } from '@/lib/utils';

export default function CategoryChips({ categories, activeId }: { categories: Category[]; activeId?: string }) {
  return (
    <div className="sticky top-[60px] z-30 bg-cream-50/95 backdrop-blur-md border-b border-cream-200">
      <div className="max-w-screen-sm mx-auto">
        <nav className="flex gap-2 overflow-x-auto no-scrollbar px-4 py-3">
          {categories.map((c) => {
            const active = c.id === activeId;
            return (
              <Link
                key={c.id}
                href={`/r/${RESTAURANT.slug}/category/${c.id}`}
                className={cn(
                  'flex items-center gap-1.5 shrink-0 px-3.5 py-1.5 rounded-full text-sm font-medium border transition-all',
                  active
                    ? 'bg-brand text-white border-brand shadow-warm'
                    : 'bg-white text-gray-700 border-cream-200 hover:border-brand-300'
                )}
              >
                <span className="text-base leading-none">{c.icon}</span>
                <span>{c.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
