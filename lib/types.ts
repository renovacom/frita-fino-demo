export type Locale = 'pt-BR' | 'en' | 'es' | 'it' | 'fr';

export type Money = number; // em reais, com 2 casas

export interface Restaurant {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  cuisine: string;
  logo: string;
  cover: string;
  rating: number;
  ratingCount: number;
  address: string;
  timezone: string;
  primary: string;
  accent: string;
  serviceFeePct: number;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  image: string;
  order: number;
}

export interface ModifierOption {
  id: string;
  name: string;
  priceDelta: Money;
}

export interface ModifierGroup {
  id: string;
  name: string;
  type: 'single' | 'multi';
  min: number;
  max: number;
  options: ModifierOption[];
}

export interface Product {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  price: Money;
  image: string;
  tags: string[];
  allergens: string[];
  prepTimeMin: number;
  calories?: number;
  rating: number;
  ratingCount: number;
  featured?: boolean;
  popular?: boolean;
  available: boolean;
  discountPct?: number;
  modifierGroups?: ModifierGroup[];
}

export interface CartItem {
  lineId: string; // UUID gerado client-side
  productId: string;
  name: string;
  image: string;
  unitPrice: Money;
  quantity: number;
  modifiers: { groupName: string; optionName: string; priceDelta: Money }[];
  notes?: string;
}

export interface OrderTimelineStep {
  id: 'submitted' | 'preparing' | 'ready' | 'delivered';
  label: string;
  at?: number; // timestamp ms
}
