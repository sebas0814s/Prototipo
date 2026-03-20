import { Trash2 } from 'lucide-react';
import { CartItem as CartItemType } from '../../types';
import { useCartStore } from '../../store';
import toast from 'react-hot-toast';

interface CartItemProps {
  item: CartItemType;
}

export default function CartItem({ item }: CartItemProps) {
  const { removeItem, updateQuantity } = useCartStore();

  const handleRemove = async () => {
    try {
      await removeItem(item.productId);
      toast.success('Producto eliminado');
    } catch {
      toast.error('Error al eliminar producto');
    }
  };

  const handleQuantityChange = async (newQty: number) => {
    if (newQty < 1) return;
    try {
      await updateQuantity(item.productId, newQty);
    } catch {
      toast.error('Error al actualizar cantidad');
    }
  };

  const formattedTotal = new Intl.NumberFormat('es-CO', {
    style: 'currency', currency: 'COP', maximumFractionDigits: 0,
  }).format(item.price * item.quantity);

  return (
    <div className="flex gap-4 p-4 bg-white rounded-2xl border border-rose-100 shadow-sm">
      {/* Image */}
      <div className="w-20 h-20 bg-rose-50 rounded-xl overflow-hidden flex-shrink-0">
        {item.imageUrl ? (
          <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-rose-100 flex items-center justify-center text-2xl">✂️</div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="font-medium text-stone-700 truncate">{item.name}</p>
        <p className="text-xs text-stone-400 mt-0.5">
          {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(item.price)} c/u
        </p>

        <div className="flex items-center gap-3 mt-3">
          {/* Quantity stepper */}
          <div className="flex items-center border border-rose-100 rounded-lg overflow-hidden bg-rose-50/50">
            <button
              onClick={() => handleQuantityChange(item.quantity - 1)}
              className="px-3 py-1.5 text-stone-500 hover:bg-rose-100 transition-colors text-sm"
            >
              −
            </button>
            <span className="px-3 py-1.5 text-sm font-semibold text-stone-700">{item.quantity}</span>
            <button
              onClick={() => handleQuantityChange(item.quantity + 1)}
              className="px-3 py-1.5 text-stone-500 hover:bg-rose-100 transition-colors text-sm"
            >
              +
            </button>
          </div>

          <button onClick={handleRemove} className="text-rose-300 hover:text-red-400 transition-colors">
            <Trash2 size={17} />
          </button>
        </div>
      </div>

      {/* Line total */}
      <div className="text-right flex-shrink-0 self-center">
        <span className="font-bold text-rose-500">{formattedTotal}</span>
      </div>
    </div>
  );
}
