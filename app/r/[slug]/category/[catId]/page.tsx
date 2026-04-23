import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import CategoryChips from '@/components/CategoryChips';
import ProductCard from '@/components/ProductCard';
import { CATEGORIES, getCategory, productsByCategory } from '@/lib/mock-data';

interface Props {
  params: { catId: string; slug: string };
}

export function generateStaticParams() {
  return CATEGORIES.map((c) => ({ catId: c.id }));
}

export default function CategoryPage({ params }: Props) {
  const category = getCategory(params.catId);
  const items = productsByCategory(params.catId);
  if (!category && params.catId !== 'c_destaques') notFound();

  const title = params.catId === 'c_destaques' ? 'Mais pedidos' : category?.name;

  return (
    <>
      <Header title={title} showBack />
      <CategoryChips categories={CATEGORIES} activeId={params.catId} />
      <section className="px-4 py-4">
        {items.length === 0 ? (
          <div className="py-16 text-center text-gray-500">
            <p>Nenhum item nesta categoria no momento.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {items.map((p) => (
              <ProductCard key={p.id} product={p} compact />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
