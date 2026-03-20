import { useQuery } from '@tanstack/react-query';
import { Package, ShoppingBag, TrendingUp, Plus, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { adminProductApi, orderApi } from '../../services/api';
import AdminLayout from '../../components/admin/AdminLayout';

export default function AdminDashboard() {
  const { data: productsData } = useQuery({ queryKey: ['admin-products'], queryFn: adminProductApi.getAll });
  const { data: ordersData }   = useQuery({ queryKey: ['admin-orders'],   queryFn: orderApi.getMyOrders });

  const products = productsData?.data?.data ?? [];
  const orders   = ordersData?.data?.data   ?? [];
  const outOfStock = products.filter((p) => p.stock === 0).length;
  const totalValue = products.reduce((acc, p) => acc + p.price * p.stock, 0);

  const stats = [
    { label: 'Productos activos',  value: products.length,  icon: Package,     color: 'bg-rose-50 text-rose-500'   },
    { label: 'Pedidos recibidos',  value: orders.length,    icon: ShoppingBag, color: 'bg-blue-50 text-blue-500'   },
    { label: 'Sin stock',          value: outOfStock,       icon: TrendingUp,  color: 'bg-amber-50 text-amber-500' },
    { label: 'Valor inventario',
      value: new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(totalValue),
      icon: TrendingUp, color: 'bg-green-50 text-green-500' },
  ];

  return (
    <AdminLayout>
      <div className="p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-stone-800">Dashboard</h1>
            <p className="text-stone-400 text-sm mt-1">Resumen de tu tienda Jalac</p>
          </div>
          <Link
            to="/admin/products/new"
            className="inline-flex items-center gap-2 bg-rose-400 hover:bg-rose-500 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors shadow-sm"
          >
            <Plus size={16} /> Nuevo producto
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="bg-white rounded-2xl p-5 border border-stone-100 shadow-sm">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${color}`}>
                <Icon size={18} />
              </div>
              <p className="text-2xl font-bold text-stone-800">{value}</p>
              <p className="text-stone-400 text-xs mt-1">{label}</p>
            </div>
          ))}
        </div>

        {/* Últimos productos */}
        <div className="bg-white rounded-2xl border border-stone-100 shadow-sm">
          <div className="flex items-center justify-between px-6 py-4 border-b border-stone-50">
            <h2 className="font-semibold text-stone-700">Productos recientes</h2>
            <Link to="/admin/products" className="text-xs text-rose-400 hover:text-rose-500 flex items-center gap-1 font-medium">
              Ver todos <ArrowRight size={12} />
            </Link>
          </div>
          <div className="divide-y divide-stone-50">
            {products.slice(0, 5).map((p) => (
              <div key={p.id} className="flex items-center gap-4 px-6 py-3">
                <div className="w-10 h-10 bg-rose-50 rounded-lg overflow-hidden flex-shrink-0">
                  {p.images[0]
                    ? <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" />
                    : <span className="w-full h-full flex items-center justify-center text-rose-200 text-lg">✂️</span>}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-stone-700 truncate">{p.name}</p>
                  <p className="text-xs text-stone-400">Stock: {p.stock}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-bold text-rose-500">
                    {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(p.price)}
                  </p>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${p.stock > 0 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'}`}>
                    {p.stock > 0 ? 'Disponible' : 'Agotado'}
                  </span>
                </div>
                <Link to={`/admin/products/${p.id}/edit`} className="ml-2 text-xs text-stone-400 hover:text-rose-500 transition-colors font-medium">
                  Editar
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
