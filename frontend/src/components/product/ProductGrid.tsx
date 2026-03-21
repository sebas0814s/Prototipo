import { Product } from '../../types';
import ProductCard from './ProductCard';

interface ProductGridProps {
  products: Product[];
  isLoading?: boolean;
}

function SkeletonCard() {
  return (
    <div className="bg-white dark:bg-stone-800 rounded-2xl overflow-hidden border border-stone-100 dark:border-stone-700">
      <div className="aspect-square skeleton" />
      <div className="p-4 space-y-3">
        <div className="h-4 skeleton rounded w-3/4" />
        <div className="h-3 skeleton rounded w-1/2" />
        <div className="flex justify-between items-center pt-2">
          <div className="h-5 skeleton rounded w-1/3" />
          <div className="h-8 skeleton rounded-lg w-24" />
        </div>
      </div>
    </div>
  );
}

export default function ProductGrid({ products, isLoading }: ProductGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {Array.from({ length: 8 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-20 text-stone-400 dark:text-stone-500">
        <div className="text-5xl mb-4">🔍</div>
        <p className="text-lg font-medium">No se encontraron productos</p>
        <p className="text-sm mt-1">Intenta ajustar los filtros</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
