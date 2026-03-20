import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Pencil, Trash2, RotateCcw, Search, Download, Upload } from 'lucide-react';
import { adminProductApi } from '../../services/api';
import { Product } from '../../types';
import AdminLayout from '../../components/admin/AdminLayout';
import toast from 'react-hot-toast';

export default function ProductsAdmin() {
  const qc          = useQueryClient();
  const importRef   = useRef<HTMLInputElement>(null);
  const [search, setSearch]       = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [importing, setImporting]  = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-products'],
    queryFn: adminProductApi.getAll,
  });

  const products = (data?.data?.data ?? []).filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const refresh = () => qc.invalidateQueries({ queryKey: ['admin-products'] });

  const deleteMutation = useMutation({
    mutationFn: adminProductApi.delete,
    onSuccess: () => { refresh(); toast.success('Producto eliminado'); setDeletingId(null); },
    onError:   () => toast.error('Error al eliminar'),
  });

  const resetMutation = useMutation({
    mutationFn: adminProductApi.resetToDefaults,
    onSuccess: () => { refresh(); toast.success('Catálogo restaurado'); },
  });

  const fmt = (n: number) =>
    new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(n);

  /* ── Exportar catálogo como archivo JSON ── */
  const handleExport = async () => {
    try {
      const { data: res } = await adminProductApi.getAll();
      const allProducts   = res.data ?? [];
      const blob   = new Blob([JSON.stringify(allProducts, null, 2)], { type: 'application/json' });
      const url    = URL.createObjectURL(blob);
      const link   = document.createElement('a');
      link.href    = url;
      link.download = `jalac-catalogo-${new Date().toISOString().slice(0, 10)}.json`;
      link.click();
      URL.revokeObjectURL(url);
      toast.success(`Catálogo exportado (${allProducts.length} productos)`);
    } catch {
      toast.error('Error al exportar');
    }
  };

  /* ── Importar catálogo desde archivo JSON ── */
  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImporting(true);
    try {
      const text     = await file.text();
      const products = JSON.parse(text) as Product[];
      if (!Array.isArray(products)) throw new Error('Formato inválido');
      await adminProductApi.replaceAll(products);
      refresh();
      toast.success(`${products.length} productos importados correctamente`);
    } catch {
      toast.error('Error al importar. Verifica que sea un archivo válido de Jalac.');
    } finally {
      setImporting(false);
      if (importRef.current) importRef.current.value = '';
    }
  };

  return (
    <AdminLayout>
      <div className="p-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-stone-800">Productos</h1>
            <p className="text-stone-400 text-sm mt-1">{products.length} productos en el catálogo</p>
          </div>

          <div className="flex flex-wrap gap-2">
            {/* Exportar */}
            <button
              onClick={handleExport}
              className="flex items-center gap-1.5 px-3 py-2 bg-green-50 border border-green-200 text-green-700 rounded-xl text-xs font-semibold hover:bg-green-100 transition-colors"
              title="Descargar catálogo como archivo JSON"
            >
              <Download size={13} /> Exportar catálogo
            </button>

            {/* Importar */}
            <label
              className={`flex items-center gap-1.5 px-3 py-2 bg-blue-50 border border-blue-200 text-blue-700 rounded-xl text-xs font-semibold hover:bg-blue-100 transition-colors cursor-pointer ${importing ? 'opacity-60 pointer-events-none' : ''}`}
              title="Cargar catálogo desde archivo JSON"
            >
              <input ref={importRef} type="file" accept=".json" className="hidden" onChange={handleImport} />
              {importing
                ? <><span className="w-3 h-3 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" /> Importando...</>
                : <><Upload size={13} /> Importar catálogo</>
              }
            </label>

            {/* Restaurar demo */}
            <button
              onClick={() => resetMutation.mutate()}
              disabled={resetMutation.isPending}
              className="flex items-center gap-1.5 px-3 py-2 border border-stone-200 rounded-xl text-xs text-stone-500 hover:bg-stone-50 transition-colors"
            >
              <RotateCcw size={13} /> Restaurar demo
            </button>

            {/* Nuevo producto */}
            <Link
              to="/admin/products/new"
              className="flex items-center gap-1.5 bg-rose-400 hover:bg-rose-500 text-white px-4 py-2 rounded-xl text-xs font-semibold transition-colors shadow-sm"
            >
              <Plus size={14} /> Nuevo producto
            </Link>
          </div>
        </div>

        {/* Banner informativo de persistencia */}
        <div className="flex items-start gap-3 bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 mb-5 text-xs text-blue-700">
          <span className="text-lg leading-none">💾</span>
          <div>
            <span className="font-semibold">Los productos se guardan automáticamente</span> en este navegador.<br />
            Para usar el catálogo en <strong>otro navegador o computador</strong>, haz clic en{' '}
            <strong>"Exportar catálogo"</strong> y luego <strong>"Importar catálogo"</strong> en el otro dispositivo.
          </div>
        </div>

        {/* Búsqueda */}
        <div className="relative mb-5">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            placeholder="Buscar producto..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-300 bg-white"
          />
        </div>

        {/* Tabla de productos */}
        <div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
          {isLoading ? (
            <div className="py-20 text-center text-stone-400">
              <div className="w-8 h-8 border-2 border-rose-300 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              Cargando productos...
            </div>
          ) : products.length === 0 ? (
            <div className="py-20 text-center text-stone-400">
              <p>No hay productos.</p>
              <Link to="/admin/products/new" className="text-rose-400 text-sm mt-2 inline-block hover:underline">
                Crear el primero
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-stone-50">
              {/* Encabezado */}
              <div className="grid grid-cols-12 px-6 py-3 text-xs font-bold text-stone-400 uppercase tracking-wider bg-stone-50">
                <span className="col-span-5">Producto</span>
                <span className="col-span-2 text-right">Precio</span>
                <span className="col-span-2 text-center">Stock</span>
                <span className="col-span-1 text-center">Estado</span>
                <span className="col-span-2 text-right">Acciones</span>
              </div>

              {products.map((p) => (
                <div key={p.id} className="grid grid-cols-12 items-center px-6 py-3.5 hover:bg-stone-50 transition-colors">

                  {/* Producto */}
                  <div className="col-span-5 flex items-center gap-3">
                    <div className="w-11 h-11 bg-rose-50 rounded-xl overflow-hidden flex-shrink-0 border border-rose-100">
                      {p.images[0]
                        ? <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" />
                        : <span className="w-full h-full flex items-center justify-center text-xl">✂️</span>}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-stone-700 truncate">{p.name}</p>
                      <p className="text-xs text-stone-400 truncate">{p.description.slice(0, 50)}…</p>
                    </div>
                  </div>

                  {/* Precio */}
                  <div className="col-span-2 text-right">
                    <span className="text-sm font-bold text-rose-500">{fmt(p.price)}</span>
                  </div>

                  {/* Stock */}
                  <div className="col-span-2 text-center">
                    <span className={`text-sm font-semibold ${p.stock > 0 ? 'text-stone-700' : 'text-red-400'}`}>
                      {p.stock}
                    </span>
                  </div>

                  {/* Estado */}
                  <div className="col-span-1 text-center">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${p.isActive ? 'bg-green-50 text-green-600' : 'bg-stone-100 text-stone-400'}`}>
                      {p.isActive ? 'Activo' : 'Oculto'}
                    </span>
                  </div>

                  {/* Acciones */}
                  <div className="col-span-2 flex items-center justify-end gap-2">
                    <Link
                      to={`/admin/products/${p.id}/edit`}
                      className="flex items-center gap-1 text-xs text-stone-500 hover:text-rose-500 border border-stone-200 hover:border-rose-300 px-2.5 py-1.5 rounded-lg transition-colors"
                    >
                      <Pencil size={11} /> Editar
                    </Link>

                    {deletingId === p.id ? (
                      <div className="flex gap-1">
                        <button
                          onClick={() => deleteMutation.mutate(p.id)}
                          className="text-xs bg-red-500 text-white px-2.5 py-1.5 rounded-lg hover:bg-red-600"
                        >
                          Sí
                        </button>
                        <button
                          onClick={() => setDeletingId(null)}
                          className="text-xs border border-stone-200 px-2 py-1.5 rounded-lg text-stone-400"
                        >
                          No
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setDeletingId(p.id)}
                        className="text-stone-300 hover:text-red-400 transition-colors p-1.5"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
