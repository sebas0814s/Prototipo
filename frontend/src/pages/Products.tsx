import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { SlidersHorizontal } from 'lucide-react';
import { productApi } from '../services/api';
import ProductGrid from '../components/product/ProductGrid';
import { FurnitureMaterial } from '../types';

const MATERIALS: { value: FurnitureMaterial | ''; label: string }[] = [
  { value: '',         label: 'Todos'   },
  { value: 'leather',  label: 'Cuero'   },
  { value: 'metal',    label: 'Acero'   },
  { value: 'wood',     label: 'Madera'  },
  { value: 'mixed',    label: 'Mixto'   },
  { value: 'fabric',   label: 'Tela'    },
];

export default function Products() {
  const [material, setMaterial] = useState<FurnitureMaterial | ''>('');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [maxPrice, setMaxPrice] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['products', { material, inStockOnly, maxPrice }],
    queryFn: () =>
      productApi.getAll({
        ...(material && { material }),
        ...(inStockOnly && { inStockOnly: true }),
        ...(maxPrice && { maxPrice }),
      }),
  });

  const products = data?.data?.data ?? [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-stone-800">Catálogo</h1>
        <p className="text-stone-400 text-sm mt-1">Mobiliario profesional para peluquerías, barberías y nail spa</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-8 p-4 bg-rose-50/60 rounded-2xl border border-rose-100">
        <SlidersHorizontal size={16} className="text-rose-400" />

        <div className="flex flex-wrap gap-2">
          {MATERIALS.map(({ value, label }) => (
            <button
              key={label}
              onClick={() => setMaterial(value)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                material === value
                  ? 'bg-rose-400 text-white shadow-sm'
                  : 'bg-white border border-rose-200 text-stone-500 hover:border-rose-300'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <input
          type="number"
          placeholder="Precio máximo (COP)"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          className="border border-rose-200 rounded-lg px-3 py-1.5 text-xs w-44 focus:outline-none focus:ring-2 focus:ring-rose-300 bg-white"
        />

        <label className="flex items-center gap-2 text-xs text-stone-500 cursor-pointer">
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={(e) => setInStockOnly(e.target.checked)}
            className="accent-rose-400"
          />
          Solo disponibles
        </label>
      </div>

      <ProductGrid products={products} isLoading={isLoading} />
    </div>
  );
}
