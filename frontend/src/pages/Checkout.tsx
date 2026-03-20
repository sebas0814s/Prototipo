import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, MapPin } from 'lucide-react';
import { useCartStore } from '../store';
import { orderApi, paymentApi } from '../services/api';
import Button from '../components/common/Button';
import toast from 'react-hot-toast';

type GatewayOption = 'wompi' | 'stripe';

export default function Checkout() {
  const navigate = useNavigate();
  const cart = useCartStore((s) => s.cart);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [gateway, setGateway] = useState<GatewayOption>('wompi');

  const [address, setAddress] = useState({
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'Colombia',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cart) return;
    setIsSubmitting(true);
    try {
      const { data: orderRes } = await orderApi.create({ shippingAddress: address });
      const order = orderRes.data!;
      await paymentApi.initiate({
        gateway,
        orderId: order.id,
        amountInCents: Math.round(cart.total * 100),
        currency: 'COP',
        customerEmail: 'demo@jalac.co',
      });
      toast.success('¡Pedido confirmado! Pago aprobado.');
      navigate('/profile');
    } catch {
      toast.error('Error al procesar el pedido');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formattedTotal = new Intl.NumberFormat('es-CO', {
    style: 'currency', currency: 'COP', maximumFractionDigits: 0,
  }).format(cart?.total ?? 0);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-2xl font-bold text-stone-800 mb-8">Finalizar Compra</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Shipping address */}
        <section className="bg-white border border-rose-100 rounded-2xl p-6 shadow-sm">
          <h2 className="flex items-center gap-2 font-semibold text-stone-700 mb-5">
            <MapPin size={18} className="text-rose-400" /> Dirección de entrega
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { name: 'street', label: 'Calle / Carrera', full: true },
              { name: 'city', label: 'Ciudad' },
              { name: 'state', label: 'Departamento' },
              { name: 'postalCode', label: 'Código postal' },
              { name: 'country', label: 'País' },
            ].map(({ name, label, full }) => (
              <div key={name} className={full ? 'sm:col-span-2' : ''}>
                <label className="block text-xs font-semibold text-stone-500 mb-1.5">{label}</label>
                <input
                  type="text"
                  required
                  value={address[name as keyof typeof address]}
                  onChange={(e) => setAddress({ ...address, [name]: e.target.value })}
                  className="w-full border border-rose-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300"
                />
              </div>
            ))}
          </div>
        </section>

        {/* Payment method */}
        <section className="bg-white border border-rose-100 rounded-2xl p-6 shadow-sm">
          <h2 className="flex items-center gap-2 font-semibold text-stone-700 mb-5">
            <CreditCard size={18} className="text-rose-400" /> Método de pago
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {(['wompi', 'stripe'] as GatewayOption[]).map((gw) => (
              <button
                key={gw}
                type="button"
                onClick={() => setGateway(gw)}
                className={`border-2 rounded-xl p-4 text-left transition-colors ${
                  gateway === gw
                    ? 'border-rose-300 bg-rose-50'
                    : 'border-stone-200 hover:border-rose-200'
                }`}
              >
                <p className="font-semibold text-stone-700 capitalize text-sm">{gw}</p>
                <p className="text-xs text-stone-400 mt-1">
                  {gw === 'wompi' ? 'Tarjetas, PSE, Nequi — Colombia' : 'Tarjetas internacionales'}
                </p>
              </button>
            ))}
          </div>
        </section>

        {/* Total */}
        <div className="flex items-center justify-between bg-rose-50 border border-rose-200 rounded-2xl px-6 py-4">
          <span className="font-semibold text-stone-700">Total a pagar</span>
          <span className="text-2xl font-bold text-rose-500">{formattedTotal}</span>
        </div>

        <Button type="submit" isLoading={isSubmitting} size="lg" className="w-full">
          Confirmar y pagar
        </Button>
      </form>
    </div>
  );
}
