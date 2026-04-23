import { redirect } from 'next/navigation';
import { RESTAURANT } from '@/lib/mock-data';

// Root redireciona para o cardápio (simula scan de QR Code de mesa)
export default function Home() {
  redirect(`/r/${RESTAURANT.slug}?mesa=12`);
}
