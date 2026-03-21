import { Link } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, Trash2, Heart } from 'lucide-react';
import { useWishlistStore, useCartStore } from '../store';
import toast from 'react-hot-toast';

export default function Wishlist() {
  const { items, removeItem } = useWishlistStore();
  const addItem = useCartStore((s) => s.addItem);

  const handleAddToCart = async (product: typeof items[0]) => {
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

  const handleRemove = (productId: string) => {
    removeItem(productId);
    toast.success('Eliminado de favoritos');
  };

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
        <div className="w-24 h-24 rounded-full bg-rose-50 dark:bg-stone-700 flex items-center justify-center mb-6">
          <Heart size={40} className="text-rose-200 dark:text-rose-600" />
        </div>
        <h2 className="text-2xl font-bold text-stone-800 dark:text-white mb-3">
          Tu lista de favoritos está vacía
        </h2>
        <p className="text-stone-500 dark:text-stone-400 mb-8 text-center max-w-md">
          ¡Explora nuestro catálogo y guarda tus productos favoritos para later!
        </p>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 bg-rose-400 hover:bg-rose-500 text-white px-6 py-3 rounded-xl font-medium transition-colors"
        >
          <ArrowLeft size={18} />
          Ver catálogo
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-stone-800 dark:text-white">Mis Favoritos</h1>
          <p className="text-stone-500 dark:text-stone-400 text-sm mt-1">
            {items.length} producto{items.length !== 1 ? 's' : ''} guardado{items.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 text-rose-400 hover:text-rose-500 font-medium text-sm transition-colors"
        >
          <ArrowLeft size={16} />
          Seguir comprando
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {items.map((product) => (
          <div
            key={product.id}
            className="bg-white dark:bg-stone-800 rounded-2xl overflow-hidden border border-stone-100 dark:border-stone-700 shadow-sm group"
          >
            {/* Imagen */}
            <Link to={`/products/${product.id}`} className="block relative aspect-square bg-rose-50 dark:bg-stone-700 overflow-hidden">
              {product.images[0] ? (
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-rose-200 dark:text-rose-400 text-5xl">✂️</div>
              )}
              
              {/* Badge material */}
              <span className="absolute top-2.5 left-2.5 bg-white/90 dark:bg-stone-800 text-rose-500 dark:text-rose-400 text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm capitalize">
                {product.material}
              </span>
              
              {/* Botón eliminar */}
              <button
                onClick={(e) => {
                  e.preventDefault();
                  handleRemove(product.id);
                }}
                className="absolute top-2.5 right-2.5 p-2 bg-white/90 dark:bg-stone-800 rounded-full shadow-md hover:bg-red-50 dark:hover:bg-red-900/50 text-stone-400 hover:text-red-500 transition-colors"
              >
                <Trash2 size={14} />
              </button>
              
              {/* Agotado */}
              {!product.stock && (
                <span className="absolute bottom-2.5 left-2.5 bg-red-50 dark:bg-red-900/50 text-red-400 dark:text-red-300 text-xs font-semibold px-2.5 py-1 rounded-full border border-red-100 dark:border-red-800">
                  Agotado
                </span>
              )}
            </Link>

            {/* Info */}
            <div className="p-4">
              <Link to={`/products/${product.id}`}>
                <h3 className="font-semibold text-stone-800 dark:text-white text-sm leading-snug line-clamp-2 hover:text-rose-400 transition-colors">
                  {product.name}
                </h3>
              </Link>
              <p className="text-xs text-stone-400 dark:text-stone-500 mt-1 line-clamp-1">
                {product.description}
              </p>
              
              <div className="flex items-center justify-between mt-3">
                <span className="text-rose-500 dark:text-rose-400 font-bold">
                  {new Intl.NumberFormat('es-CO', {
                    style: 'currency', currency: 'COP', maximumFractionDigits: 0,
                  }).format(product.price)}
                </span>
                <button
                  onClick={() => handleAddToCart(product)}
                  disabled={!product.stock}
                  className="flex items-center gap-1.5 bg-rose-400 hover:bg-rose-500 disabled:bg-stone-300 dark:disabled:bg-stone-600 text-white text-xs font-medium px-3 py-2 rounded-lg transition-colors"
                >
                  <ShoppingCart size={13} />
                  {product.stock ? 'Agregar' : 'Agotado'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
