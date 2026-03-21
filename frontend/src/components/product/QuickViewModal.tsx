import { X, ShoppingCart, Heart } from 'lucide-react';
import { Product } from '../../types';
import { useCartStore, useWishlistStore, useCartAnimationStore } from '../../store';
import toast from 'react-hot-toast';

interface QuickViewModalProps {
  product: Product;
  onClose: () => void;
}

const MATERIAL_LABELS: Record<string, string> = {
  wood: 'Madera', metal: 'Acero', glass: 'Vidrio',
  fabric: 'Tela', leather: 'Cuero', mixed: 'Mixto',
};

export default function QuickViewModal({ product, onClose }: QuickViewModalProps) {
  const addItem = useCartStore((s) => s.addItem);
  const { isInWishlist, toggleItem } = useWishlistStore();
  const triggerBounce = useCartAnimationStore((s) => s.triggerBounce);
  const inWishlist = isInWishlist(product.id);

  const handleAddToCart = async () => {
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
    }
  };

  const handleWishlist = () => {
    toggleItem(product);
    toast.success(inWishlist ? 'Eliminado de favoritos' : '¡Agregado a favoritos!');
  };

  const formattedPrice = new Intl.NumberFormat('es-CO', {
    style: 'currency', currency: 'COP', maximumFractionDigits: 0,
  }).format(product.price);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-overlay"
      style={{ backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="modal-content bg-white dark:bg-stone-800 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="grid md:grid-cols-2 gap-0">
          <div className="relative aspect-square bg-rose-50 dark:bg-stone-700">
            {product.images[0] ? (
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-rose-200 text-6xl">✂️</div>
            )}
            <button
              onClick={onClose}
              className="absolute top-3 right-3 bg-white/90 dark:bg-stone-700 p-2 rounded-full shadow-md hover:bg-white transition-colors"
            >
              <X size={18} className="text-stone-500" />
            </button>
            <button
              onClick={handleWishlist}
              className={`absolute top-3 left-3 p-2 rounded-full shadow-md transition-all ${
                inWishlist
                  ? 'bg-rose-400 text-white'
                  : 'bg-white/90 dark:bg-stone-700 text-stone-400 hover:text-rose-400'
              }`}
            >
              <Heart size={18} fill={inWishlist ? 'currentColor' : 'none'} />
            </button>
          </div>

          <div className="p-6 flex flex-col">
            <span className="text-xs font-semibold text-rose-400 uppercase tracking-wider mb-2">
              {MATERIAL_LABELS[product.material] ?? product.material}
            </span>
            <h2 className="text-xl font-bold text-stone-800 dark:text-white mb-2">{product.name}</h2>
            <p className="text-stone-500 dark:text-stone-400 text-sm leading-relaxed mb-4">
              {product.description}
            </p>
            <div className="flex items-baseline gap-2 mb-4">
              <span className="text-2xl font-bold text-rose-500">{formattedPrice}</span>
              {product.stock > 0 ? (
                <span className="text-xs text-green-500 font-medium">En stock ({product.stock})</span>
              ) : (
                <span className="text-xs text-red-400 font-medium">Agotado</span>
              )}
            </div>
            <div className="mb-5">
              <p className="text-xs text-stone-400 dark:text-stone-500 uppercase tracking-wide mb-2">Dimensiones</p>
              <p className="text-sm text-stone-600 dark:text-stone-300">
                {product.dimensions.widthCm} × {product.dimensions.heightCm} × {product.dimensions.depthCm} cm
              </p>
            </div>
            <div className="mt-auto flex flex-col gap-3">
              <button
                onClick={handleAddToCart}
                disabled={!product.stock}
                className="w-full flex items-center justify-center gap-2 bg-rose-400 hover:bg-rose-500 disabled:bg-stone-300 text-white font-semibold py-3 rounded-xl transition-colors"
              >
                {product.stock > 0 ? (
                  <>
                    <ShoppingCart size={18} /> Agregar al carrito
                  </>
                ) : (
                  <>Agotado</>
                )}
              </button>
              <button
                onClick={handleWishlist}
                className={`w-full flex items-center justify-center gap-2 font-medium py-3 rounded-xl border-2 transition-colors ${
                  inWishlist
                    ? 'border-rose-400 text-rose-400 bg-rose-50'
                    : 'border-stone-200 dark:border-stone-600 text-stone-500 dark:text-stone-300 hover:border-rose-300'
                }`}
              >
                <Heart size={18} fill={inWishlist ? 'currentColor' : 'none'} />
                {inWishlist ? 'En favoritos' : 'Agregar a favoritos'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
