'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, ShoppingBag, Sparkles, User } from 'lucide-react';
import { RESTAURANT } from '@/lib/mock-data';
import { useCart } from '@/lib/cart-store';
import { cn } from '@/lib/utils';

export default function BottomNav() {
  const pathname = usePathname();
  const base = `/r/${RESTAURANT.slug}`;
  const count = useCart((s) => s.items.reduce((acc, i) => acc + i.quantity, 0));

  const items = [
    { label: 'Cardápio', href: base, icon: Home, match: (p: string) => p === base },
    {
      label: 'Carrinho',
      href: `${base}/cart`,
      icon: ShoppingBag,
      match: (p: string) => p.includes('/cart') || p.includes('/checkout'),
      badge: count > 0 ? count : undefined,
    },
    {
      label: 'Fidelidade',
      href: `${base}/loyalty`,
      icon: Sparkles,
      match: (p: string) => p.includes('/loyalty'),
    },
    {
      label: 'Conta',
      href: `${base}/queue`,
      icon: User,
      match: (p: string) => p.includes('/queue') || p.includes('/order'),
    },
  ];

  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-lg border-t border-cream-200 pb-[env(safe-area-inset-bottom)]">
      <ul className="flex items-stretch justify-around max-w-screen-sm mx-auto">
        {items.map((it) => {
          const active = it.match(pathname);
          const Icon = it.icon;
          return (
            <li key={it.href} className="flex-1">
              <Link
                href={it.href}
                className={cn(
                  'relative flex flex-col items-center justify-center py-2.5 gap-0.5 transition-colors',
                  active ? 'text-brand-700' : 'text-gray-500 hover:text-brand-600'
                )}
              >
                <div className="relative">
                  <Icon className={cn('w-5 h-5', active && 'stroke-[2.2]')} />
                  {it.badge && (
                    <span className="absolute -top-1.5 -right-2 bg-accent text-brand-900 text-[10px] font-bold rounded-full min-w-[18px] h-[18px] px-1 flex items-center justify-center">
                      {it.badge}
                    </span>
                  )}
                </div>
                <span className={cn('text-[11px] font-medium', active && 'font-semibold')}>{it.label}</span>
                {active && (
                  <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full bg-brand" />
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
