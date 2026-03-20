import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import toast from 'react-hot-toast';
import { useCartStore } from '../store';
import CartItem from '../components/cart/CartItem';
import WhatsAppOrderModal from '../components/cart/WhatsAppOrderModal';
import { buildWhatsAppMessage, openWhatsApp, WA_QR_URL, CustomerInfo } from '../services/whatsapp';
import { logOrderToSheets } from '../services/sheets';

export default function Cart() {
  const { cart, isLoading, fetchCart, clearCart } = useCartStore();
  const [modalOpen,  setModalOpen]  = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => { fetchCart(); }, [fetchCart]);

  async function handleWhatsAppOrder(customer: CustomerInfo) {
    setSubmitting(true);
    const items    = cart?.items ?? [];
    const subtotal = cart?.subtotal ?? 0;
    const total    = cart?.total ?? 0;

    const message = buildWhatsAppMessage(items, subtotal, total, customer);

    // Abrir WhatsApp primero para no bloquear popups
    openWhatsApp(message);

    // Registrar en Google Sheets en paralelo (no bloqueante)
    logOrderToSheets(items, subtotal, total, customer);

    await clearCart();
    setSubmitting(false);
    setModalOpen(false);
    toast.success('¡Pedido enviado a WhatsApp! Te responderemos pronto 💬');
  }

  if (isLoading) {
    return (
      <div className="text-center py-32 text-stone-400">
        <div className="w-8 h-8 border-2 border-rose-300 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        Cargando carrito...
      </div>
    );
  }

  const items = cart?.items ?? [];

  if (items.length === 0) {
    return (
      <div className="text-center py-32">
        <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-5">
          <ShoppingBag size={36} className="text-rose-300" />
        </div>
        <h2 className="text-xl font-semibold text-stone-700">Tu carrito está vacío</h2>
        <p className="text-stone-400 text-sm mt-2">Explora nuestro catálogo de mobiliario profesional</p>
        <Link
          to="/products"
          className="mt-6 inline-block bg-rose-400 text-white px-6 py-3 rounded-xl font-medium hover:bg-rose-500 transition-colors"
        >
          Ver catálogo
        </Link>
      </div>
    );
  }

  const formattedSubtotal = new Intl.NumberFormat('es-CO', {
    style: 'currency', currency: 'COP', maximumFractionDigits: 0,
  }).format(cart?.subtotal ?? 0);

  const formattedIva = new Intl.NumberFormat('es-CO', {
    style: 'currency', currency: 'COP', maximumFractionDigits: 0,
  }).format((cart?.total ?? 0) - (cart?.subtotal ?? 0));

  const formattedTotal = new Intl.NumberFormat('es-CO', {
    style: 'currency', currency: 'COP', maximumFractionDigits: 0,
  }).format(cart?.total ?? 0);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-2xl font-bold text-stone-800 mb-2">Mi Carrito</h1>
      <p className="text-stone-400 text-sm mb-8">{cart?.totalUnits} producto(s) seleccionado(s)</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Items */}
        <div className="lg:col-span-2 space-y-3">
          {items.map((item) => (
            <CartItem key={item.productId} item={item} />
          ))}
        </div>

        {/* Summary */}
        <div className="bg-white border border-rose-100 rounded-2xl p-6 h-fit shadow-sm space-y-5">
          <h2 className="font-semibold text-stone-700">Resumen del pedido</h2>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between text-stone-500">
              <span>Subtotal</span>
              <span>{formattedSubtotal}</span>
            </div>
            <div className="flex justify-between text-stone-500">
              <span>IVA (19%)</span>
              <span>{formattedIva}</span>
            </div>
            <div className="border-t border-rose-100 pt-3 flex justify-between font-bold text-stone-800">
              <span>Total</span>
              <span className="text-rose-500">{formattedTotal}</span>
            </div>
          </div>

          {/* Botón principal WhatsApp */}
          <button
            onClick={() => setModalOpen(true)}
            className="w-full flex items-center justify-center gap-2.5 bg-[#25D366] hover:bg-[#1ebe5d] active:bg-[#17a854] text-white font-bold py-3.5 rounded-2xl transition-colors shadow-sm text-sm"
          >
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Pedir por WhatsApp
          </button>

          {/* Divider "o" */}
          <div className="flex items-center gap-3 text-stone-300 text-xs">
            <div className="flex-1 h-px bg-stone-100" />
            <span>o escanea para chatear</span>
            <div className="flex-1 h-px bg-stone-100" />
          </div>

          {/* QR WhatsApp */}
          <div className="flex flex-col items-center gap-2">
            <div className="p-2 bg-white border-2 border-[#075E54]/20 rounded-xl inline-block">
              <img
                src={WA_QR_URL}
                alt="QR WhatsApp Jalac"
                width={120}
                height={120}
                className="rounded-lg block"
              />
            </div>
            <p className="text-xs text-stone-400 text-center leading-snug">
              Apunta la cámara de tu teléfono<br />para abrir el chat directo
            </p>
          </div>

          <Link
            to="/products"
            className="block text-center text-xs text-rose-400 hover:text-rose-500 transition-colors"
          >
            ← Seguir comprando
          </Link>
        </div>
      </div>

      <WhatsAppOrderModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={handleWhatsAppOrder}
        isLoading={submitting}
      />
    </div>
  );
}
