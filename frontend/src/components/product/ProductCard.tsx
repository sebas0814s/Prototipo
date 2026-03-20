import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { Product } from '../../types';
import { useCartStore } from '../../store';
import toast from 'react-hot-toast';

interface ProductCardProps {
  product: Product;
}

const MATERIAL_LABELS: Record<string, string> = {
  wood: 'Madera', metal: 'Acero', glass: 'Vidrio',
  fabric: 'Tela', leather: 'Cuero', mixed: 'Mixto',
};

export default function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      await addItem({
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        imageUrl: product.images[0] ?? '',
      });
      toast.success('¡Agregado al carrito!');
    } catch {
      toast.error('Error al agregar al carrito');
    }
  };

  const formattedPrice = new Intl.NumberFormat('es-CO', {
    style: 'currency', currency: 'COP', maximumFractionDigits: 0,
  }).format(product.price);

  return (
    <Link
      to={`/products/${product.id}`}
      className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-stone-100 shadow-sm hover:shadow-md hover:border-rose-200 transition-all duration-200"
    >
      {/* ── Imagen con proporción fija 1:1 ── */}
      <div className="relative aspect-square bg-rose-50 overflow-hidden">
        {product.images[0] ? (
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-rose-200 text-5xl">✂️</div>
        )}

        {/* Badge material — esquina superior izquierda */}
        <span className="absolute top-2.5 left-2.5 bg-white/90 backdrop-blur-sm text-rose-500 text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm">
          {MATERIAL_LABELS[product.material] ?? product.material}
        </span>

        {/* Badge agotado */}
        {!product.stock && (
          <span className="absolute top-2.5 right-2.5 bg-red-50 text-red-400 text-xs font-semibold px-2.5 py-1 rounded-full border border-red-100">
            Agotado
          </span>
        )}
      </div>

      {/* ── Info ── */}
      <div className="flex flex-col flex-1 p-4 gap-3">
        <div className="flex-1">
          <h3 className="font-semibold text-stone-800 text-sm leading-snug line-clamp-2">
            {product.name}
          </h3>
          <p className="text-xs text-stone-400 mt-1 line-clamp-1">
            {product.description}
          </p>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-rose-500 font-bold text-base">{formattedPrice}</span>
          <button
            onClick={handleAddToCart}
            disabled={!product.stock}
            className="flex items-center gap-1.5 bg-rose-400 hover:bg-rose-500 text-white
                       text-xs font-medium px-3 py-2 rounded-lg
                       disabled:opacity-40 disabled:cursor-not-allowed
                       transition-colors duration-150"
          >
            <ShoppingCart size={13} />
            Agregar
          </button>
        </div>
      </div>
    </Link>
  );
}
