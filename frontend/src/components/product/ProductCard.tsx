import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Heart, Eye } from 'lucide-react';
import { Product } from '../../types';
import { useCartStore, useWishlistStore, useCartAnimationStore } from '../../store';
import toast from 'react-hot-toast';
import QuickViewModal from './QuickViewModal';

interface ProductCardProps {
  product: Product;
}

const MATERIAL_LABELS: Record<string, string> = {
  wood: 'Madera', metal: 'Acero', glass: 'Vidrio',
  fabric: 'Tela', leather: 'Cuero', mixed: 'Mixto',
};

export default function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem);
  const { isInWishlist, toggleItem } = useWishlistStore();
  const triggerBounce = useCartAnimationStore((s) => s.triggerBounce);
  const [showQuickView, setShowQuickView] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [isHeartAnimating, setIsHeartAnimating] = useState(false);

  const inWishlist = isInWishlist(product.id);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAdding(true);
    try {
      await addItem({
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        imageUrl: product.images[0] ?? '',
      });
      triggerBounce();
      toast.success('¡Agregado al carrito!');
    } catch {
      toast.error('Error al agregar al carrito');
    } finally {
      setTimeout(() => setIsAdding(false), 400);
    }
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleItem(product);
    setIsHeartAnimating(true);
    setTimeout(() => setIsHeartAnimating(false), 400);
    toast.success(inWishlist ? 'Eliminado de favoritos' : '¡Agregado a favoritos!');
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowQuickView(true);
  };

  const formattedPrice = new Intl.NumberFormat('es-CO', {
    style: 'currency', currency: 'COP', maximumFractionDigits: 0,
  }).format(product.price);

  return (
    <>
      <Link
        to={`/products/${product.id}`}
        className="group flex flex-col bg-white dark:bg-stone-800 rounded-2xl overflow-hidden border border-stone-100 dark:border-stone-700 shadow-sm hover:shadow-lg hover:border-rose-200 dark:hover:border-rose-500 transition-all duration-200"
      >
        <div className="relative aspect-square bg-rose-50 dark:bg-stone-700 overflow-hidden">
          {product.images[0] ? (
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-rose-200 dark:text-rose-400 text-5xl">✂️</div>
          )}

          <div className="absolute inset-0 bg-stone-900/20 dark:bg-stone-900/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-3">
            <button
              onClick={handleQuickView}
              className="p-3 bg-white dark:bg-stone-800 rounded-full shadow-lg hover:scale-110 transition-transform"
              title="Vista rápida"
            >
              <Eye size={18} className="text-stone-600 dark:text-stone-200" />
            </button>
          </div>

          <button
            onClick={handleWishlist}
            className={`absolute top-2.5 right-2.5 p-2 rounded-full shadow-md transition-all z-10 ${
              inWishlist
                ? 'bg-rose-400 text-white'
                : 'bg-white/90 dark:bg-stone-700 text-stone-400 hover:text-rose-400'
            } ${isHeartAnimating ? 'heart-pulse' : ''}`}
          >
            <Heart size={16} fill={inWishlist ? 'currentColor' : 'none'} />
          </button>

          <span className="absolute bottom-2.5 left-2.5 bg-white/90 dark:bg-stone-800 backdrop-blur-sm text-rose-500 dark:text-rose-400 text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm">
            {MATERIAL_LABELS[product.material] ?? product.material}
          </span>

          {!product.stock && (
            <span className="absolute top-2.5 left-2.5 bg-red-50 dark:bg-red-900/50 text-red-400 dark:text-red-300 text-xs font-semibold px-2.5 py-1 rounded-full border border-red-100 dark:border-red-800">
              Agotado
            </span>
          )}
        </div>

        <div className="flex flex-col flex-1 p-4 gap-3">
          <div className="flex-1">
            <h3 className="font-semibold text-stone-800 dark:text-white text-sm leading-snug line-clamp-2">
              {product.name}
            </h3>
            <p className="text-xs text-stone-400 dark:text-stone-500 mt-1 line-clamp-1">
              {product.description}
            </p>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-rose-500 dark:text-rose-400 font-bold text-base">{formattedPrice}</span>
            <button
              onClick={handleAddToCart}
              disabled={!product.stock}
              className={`flex items-center gap-1.5 text-white text-xs font-medium px-3 py-2 rounded-lg transition-all duration-200 ${
                isAdding
                  ? 'bg-green-400 add-success'
                  : 'bg-rose-400 hover:bg-rose-500 disabled:bg-stone-300 dark:disabled:bg-stone-600'
              } disabled:cursor-not-allowed`}
            >
              <ShoppingCart size={13} />
              {isAdding ? '¡Listo!' : 'Agregar'}
            </button>
          </div>
        </div>
      </Link>

      {showQuickView && (
        <QuickViewModal product={product} onClose={() => setShowQuickView(false)} />
      )}
    </>
  );
}
