import { useQuery } from '@tanstack/react-query';
import { Package, User as UserIcon, LayoutDashboard, ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { orderApi } from '../services/api';
import { useAuthStore } from '../store';
import { Order } from '../types';

const STATUS_LABELS: Record<string, string> = {
  pending_payment: 'Pendiente de pago',
  paid:            'Pagado',
  processing:      'En preparación',
  shipped:         'En camino',
  delivered:       'Entregado',
  cancelled:       'Cancelado',
};

const STATUS_COLORS: Record<string, string> = {
  pending_payment: 'bg-yellow-50 text-yellow-600 border border-yellow-200',
  paid:            'bg-blue-50 text-blue-600 border border-blue-200',
  processing:      'bg-purple-50 text-purple-600 border border-purple-200',
  shipped:         'bg-indigo-50 text-indigo-600 border border-indigo-200',
  delivered:       'bg-green-50 text-green-600 border border-green-200',
  cancelled:       'bg-red-50 text-red-500 border border-red-200',
};

export default function Profile() {
  /* Leer directamente del store — no depende de API call que se reinicia */
  const { isAuthenticated, user } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'profile' | 'orders'>('profile');

  const { data: ordersData } = useQuery({
    queryKey: ['orders'],
    queryFn: () => orderApi.getMyOrders(),
    enabled: activeTab === 'orders',
  });

  const orders: Order[] = ordersData?.data?.data ?? [];
  const isAdmin = user?.role === 'admin';

  if (!isAuthenticated || !user) {
    return (
      <div className="text-center py-32">
        <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-5">
          <UserIcon size={32} className="text-rose-300" />
        </div>
        <h2 className="text-xl font-semibold text-stone-700">Inicia sesión para ver tu perfil</h2>
        <Link
          to="/login"
          className="mt-6 inline-block bg-rose-400 text-white px-6 py-3 rounded-xl font-medium hover:bg-rose-500 transition-colors"
        >
          Iniciar sesión
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-2xl font-bold text-stone-800 mb-8">Mi cuenta</h1>

      {/* Banner de acceso admin */}
      {isAdmin && (
        <Link
          to="/admin"
          className="flex items-center gap-3 bg-gradient-to-r from-rose-400 to-pink-400 text-white px-5 py-4 rounded-2xl mb-6 hover:from-rose-500 hover:to-pink-500 transition-all shadow-sm"
        >
          <ShieldCheck size={22} />
          <div className="flex-1">
            <p className="font-semibold text-sm">Panel de Administración</p>
            <p className="text-xs text-rose-100">Gestiona productos, precios e imágenes</p>
          </div>
          <LayoutDashboard size={18} className="opacity-80" />
        </Link>
      )}

      {/* Tabs */}
      <div className="flex gap-2 mb-8">
        {([
          ['profile', 'Mi perfil',    UserIcon],
          ['orders',  'Mis pedidos',  Package],
        ] as const).map(([tab, label, Icon]) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              activeTab === tab
                ? 'bg-rose-400 text-white shadow-sm'
                : 'bg-rose-50 text-stone-500 hover:bg-rose-100'
            }`}
          >
            <Icon size={15} /> {label}
          </button>
        ))}
      </div>

      {/* ── Pestaña Perfil ── */}
      {activeTab === 'profile' && (
        <div className="bg-white border border-rose-100 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-4 mb-5">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center font-bold text-2xl ${isAdmin ? 'bg-rose-400 text-white' : 'bg-rose-100 text-rose-500'}`}>
              {user.firstName?.[0]?.toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <p className="text-lg font-semibold text-stone-800">{user.firstName} {user.lastName}</p>
                {isAdmin && (
                  <span className="text-xs bg-rose-100 text-rose-500 font-bold px-2 py-0.5 rounded-full">Admin</span>
                )}
              </div>
              <p className="text-stone-400 text-sm">{user.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm text-stone-500 border-t border-rose-50 pt-5">
            <div>
              <span className="font-medium text-stone-700">Teléfono: </span>
              {user.phone ?? '—'}
            </div>
            <div>
              <span className="font-medium text-stone-700">Rol: </span>
              {isAdmin ? 'Administrador' : 'Cliente'}
            </div>
          </div>

          {isAdmin && (
            <div className="mt-5 pt-5 border-t border-rose-50">
              <p className="text-xs text-stone-400 mb-3 font-medium uppercase tracking-wide">Accesos rápidos</p>
              <div className="grid grid-cols-2 gap-3">
                <Link
                  to="/admin/products"
                  className="flex items-center gap-2 border border-rose-200 text-rose-500 hover:bg-rose-50 px-4 py-3 rounded-xl text-sm font-medium transition-colors"
                >
                  <Package size={16} /> Editar productos
                </Link>
                <Link
                  to="/admin/products/new"
                  className="flex items-center gap-2 bg-rose-400 text-white hover:bg-rose-500 px-4 py-3 rounded-xl text-sm font-medium transition-colors"
                >
                  <Package size={16} /> Nuevo producto
                </Link>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Pestaña Pedidos ── */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          {orders.length === 0 ? (
            <div className="text-center py-16 text-stone-400">
              <Package size={40} className="mx-auto mb-3 text-rose-200" />
              <p>Aún no hay pedidos registrados.</p>
              <Link to="/products" className="text-rose-400 text-sm mt-2 inline-block hover:underline">
                Ver catálogo
              </Link>
            </div>
          ) : (
            orders.map((order) => (
              <div key={order.id} className="bg-white border border-rose-100 rounded-2xl p-5 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs text-stone-400 font-mono">
                    Pedido #{order.id.slice(0, 8).toUpperCase()}
                  </p>
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${STATUS_COLORS[order.status] ?? 'bg-stone-100 text-stone-400'}`}>
                    {STATUS_LABELS[order.status] ?? order.status}
                  </span>
                </div>
                <p className="text-sm text-stone-500">
                  {order.items.length} artículo(s) ·{' '}
                  {new Date(order.createdAt).toLocaleDateString('es-CO', {
                    day: 'numeric', month: 'long', year: 'numeric',
                  })}
                </p>
                <p className="text-lg font-bold text-rose-500 mt-2">
                  {new Intl.NumberFormat('es-CO', {
                    style: 'currency', currency: 'COP', maximumFractionDigits: 0,
                  }).format(order.total)}
                </p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
