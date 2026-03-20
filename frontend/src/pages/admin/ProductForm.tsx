import { useState, useRef, useEffect, ChangeEvent } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Upload, X, ImagePlus, Save, Eye, EyeOff } from 'lucide-react';
import { adminProductApi } from '../../services/api';
import { compressImage, base64Size } from '../../utils/imageCompressor';
import { FurnitureMaterial, Product } from '../../types';
import AdminLayout from '../../components/admin/AdminLayout';
import toast from 'react-hot-toast';

const MATERIALS: { value: FurnitureMaterial; label: string }[] = [
  { value: 'leather', label: 'Cuero / Vinilo' },
  { value: 'metal',   label: 'Acero / Metal'  },
  { value: 'wood',    label: 'Madera'          },
  { value: 'mixed',   label: 'Mixto'           },
  { value: 'fabric',  label: 'Tela'            },
  { value: 'glass',   label: 'Vidrio'          },
];

const CATEGORIES = [
  { id: 'cat-1', name: 'Sillas de Barbería'   },
  { id: 'cat-2', name: 'Sillas de Peluquería' },
  { id: 'cat-3', name: 'Nail & Spa'           },
  { id: 'cat-4', name: 'Recepción'            },
  { id: 'cat-5', name: 'Accesorios'           },
];

const DIMENSION_FIELDS: { label: string; key: 'widthCm' | 'heightCm' | 'depthCm' }[] = [
  { label: 'Ancho',       key: 'widthCm'  },
  { label: 'Alto',        key: 'heightCm' },
  { label: 'Profundidad', key: 'depthCm'  },
];

interface FormState {
  name: string;
  description: string;
  material: FurnitureMaterial;
  price: string;
  stock: string;
  categoryId: string;
  widthCm: string;
  heightCm: string;
  depthCm: string;
  images: string[];
  isActive: boolean;
}

const EMPTY: FormState = {
  name: '', description: '', material: 'leather', price: '', stock: '',
  categoryId: 'cat-1', widthCm: '', heightCm: '', depthCm: '',
  images: [], isActive: true,
};

export default function ProductForm() {
  const { id }   = useParams<{ id: string }>();
  const isEdit   = !!id;
  const navigate = useNavigate();
  const qc       = useQueryClient();
  const fileRef  = useRef<HTMLInputElement>(null);

  const [form, setForm]       = useState<FormState>(EMPTY);
  const [uploading, setUploading] = useState(false);

  const setField = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  /* Cargar datos al editar */
  const { data: allProducts } = useQuery({
    queryKey: ['admin-products'],
    queryFn: adminProductApi.getAll,
    enabled: isEdit,
  });

  useEffect(() => {
    if (!isEdit || !allProducts?.data?.data) return;
    const p = allProducts.data.data.find((x) => x.id === id);
    if (!p) return;
    setForm({
      name: p.name,
      description: p.description,
      material: p.material,
      price: String(p.price),
      stock: String(p.stock),
      categoryId: p.categoryId,
      widthCm:  String(p.dimensions.widthCm),
      heightCm: String(p.dimensions.heightCm),
      depthCm:  String(p.dimensions.depthCm),
      images: p.images,
      isActive: p.isActive,
    });
  }, [allProducts, id, isEdit]);

  /* Subir y comprimir imágenes */
  const handleFiles = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    setUploading(true);
    try {
      const compressed = await Promise.all(files.map((f) => compressImage(f)));
      setField('images', [...form.images, ...compressed]);
      toast.success(`${files.length} imagen(es) subida(s)`);
    } catch {
      toast.error('Error al procesar las imágenes');
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const removeImage = (idx: number) =>
    setField('images', form.images.filter((_, i) => i !== idx));

  const setMainImage = (idx: number) => {
    const imgs = [...form.images];
    const [item] = imgs.splice(idx, 1);
    setField('images', [item, ...imgs]);
  };

  /* Mutaciones */
  const createMutation = useMutation({
    mutationFn: adminProductApi.create,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-products'] });
      toast.success('Producto creado ✓');
      navigate('/admin/products');
    },
    onError: () => toast.error('Error al crear el producto'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ pid, data }: { pid: string; data: Partial<Product> }) =>
      adminProductApi.update(pid, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-products'] });
      toast.success('Producto actualizado ✓');
      navigate('/admin/products');
    },
    onError: () => toast.error('Error al actualizar'),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name:        form.name.trim(),
      description: form.description.trim(),
      material:    form.material,
      price:       Number(form.price),
      stock:       Number(form.stock),
      categoryId:  form.categoryId,
      dimensions: {
        widthCm:  Number(form.widthCm),
        heightCm: Number(form.heightCm),
        depthCm:  Number(form.depthCm),
      },
      images:   form.images,
      isActive: form.isActive,
    };

    if (isEdit && id) {
      updateMutation.mutate({ pid: id, data: payload });
    } else {
      createMutation.mutate(payload as Omit<Product, 'id' | 'createdAt'>);
    }
  };

  const isSaving = createMutation.isPending || updateMutation.isPending;

  return (
    <AdminLayout>
      <div className="p-6 max-w-4xl">

        {/* Header */}
        <div className="flex items-center gap-3 mb-7">
          <Link
            to="/admin/products"
            className="p-2 text-stone-400 hover:text-stone-600 hover:bg-stone-100 rounded-xl transition-colors"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-stone-800">
              {isEdit ? 'Editar producto' : 'Nuevo producto'}
            </h1>
            <p className="text-stone-400 text-sm">
              {isEdit ? 'Modifica la información y guarda' : 'Completa los datos del nuevo mueble'}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

            {/* ── Columna principal ── */}
            <div className="lg:col-span-2 space-y-4">

              {/* Info básica */}
              <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-5 space-y-4">
                <h2 className="text-xs font-bold text-stone-400 uppercase tracking-wider">
                  Información básica
                </h2>

                <div>
                  <label className="block text-xs font-semibold text-stone-600 mb-1.5">
                    Nombre del producto *
                  </label>
                  <input
                    required
                    value={form.name}
                    onChange={(e) => setField('name', e.target.value)}
                    placeholder="Ej: Silla Barbero Hidráulica Premium"
                    className="w-full border border-stone-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-600 mb-1.5">
                    Descripción *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={form.description}
                    onChange={(e) => setField('description', e.target.value)}
                    placeholder="Describe materiales, características y detalles..."
                    className="w-full border border-stone-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300 resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-600 mb-1.5">Material *</label>
                    <select
                      value={form.material}
                      onChange={(e) => setField('material', e.target.value as FurnitureMaterial)}
                      className="w-full border border-stone-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300 bg-white"
                    >
                      {MATERIALS.map((m) => (
                        <option key={m.value} value={m.value}>{m.label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-600 mb-1.5">Categoría *</label>
                    <select
                      value={form.categoryId}
                      onChange={(e) => setField('categoryId', e.target.value)}
                      className="w-full border border-stone-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300 bg-white"
                    >
                      {CATEGORIES.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Precio y Stock */}
              <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-5 space-y-4">
                <h2 className="text-xs font-bold text-stone-400 uppercase tracking-wider">
                  Precio y Stock
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-600 mb-1.5">
                      Precio (COP) *
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 text-sm">$</span>
                      <input
                        required
                        type="number"
                        min="0"
                        value={form.price}
                        onChange={(e) => setField('price', e.target.value)}
                        placeholder="1500000"
                        className="w-full border border-stone-200 rounded-xl pl-7 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300"
                      />
                    </div>
                    {form.price && (
                      <p className="text-xs text-rose-400 mt-1">
                        {new Intl.NumberFormat('es-CO', {
                          style: 'currency', currency: 'COP', maximumFractionDigits: 0,
                        }).format(Number(form.price))}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-600 mb-1.5">
                      Unidades disponibles *
                    </label>
                    <input
                      required
                      type="number"
                      min="0"
                      value={form.stock}
                      onChange={(e) => setField('stock', e.target.value)}
                      placeholder="10"
                      className="w-full border border-stone-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300"
                    />
                  </div>
                </div>
              </div>

              {/* Dimensiones */}
              <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-5 space-y-4">
                <h2 className="text-xs font-bold text-stone-400 uppercase tracking-wider">
                  Dimensiones (cm) — opcional
                </h2>
                <div className="grid grid-cols-3 gap-4">
                  {DIMENSION_FIELDS.map(({ label, key }) => (
                    <div key={key}>
                      <label className="block text-xs font-semibold text-stone-600 mb-1.5">
                        {label}
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={form[key]}
                        onChange={(e) => setField(key, e.target.value)}
                        placeholder="0"
                        className="w-full border border-stone-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ── Columna lateral ── */}
            <div className="space-y-4">

              {/* Imágenes */}
              <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-5">
                <h2 className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-4">
                  Fotos del producto
                </h2>

                {/* Zona de subida */}
                <div
                  onClick={() => fileRef.current?.click()}
                  className="border-2 border-dashed border-rose-200 rounded-xl p-5 text-center cursor-pointer hover:bg-rose-50 hover:border-rose-300 transition-colors"
                >
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleFiles}
                  />
                  {uploading ? (
                    <div className="flex flex-col items-center gap-2 text-rose-400">
                      <div className="w-6 h-6 border-2 border-rose-400 border-t-transparent rounded-full animate-spin" />
                      <span className="text-xs">Procesando...</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-stone-400">
                      <ImagePlus size={26} className="text-rose-300" />
                      <p className="text-xs font-medium">Haz clic para subir fotos</p>
                      <p className="text-xs text-stone-300">JPG, PNG — varios archivos a la vez</p>
                      <span className="inline-flex items-center gap-1 text-xs bg-rose-50 text-rose-400 px-3 py-1 rounded-full mt-1 border border-rose-100">
                        <Upload size={11} /> Seleccionar fotos
                      </span>
                    </div>
                  )}
                </div>

                {/* Previsualización */}
                {form.images.length > 0 && (
                  <div className="mt-4">
                    <p className="text-xs text-stone-400 mb-2">
                      {form.images.length} foto(s) — la primera es la principal
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      {form.images.map((img, i) => (
                        <div key={i} className="relative group">
                          <img
                            src={img}
                            alt=""
                            className={`w-full h-20 object-cover rounded-xl ${i === 0 ? 'ring-2 ring-rose-400' : ''}`}
                          />
                          {i === 0 && (
                            <span className="absolute top-1 left-1 bg-rose-400 text-white text-xs px-1.5 py-0.5 rounded-md">
                              Principal
                            </span>
                          )}
                          {/* Controles hover */}
                          <div className="absolute inset-0 bg-black/40 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5">
                            {i > 0 && (
                              <button
                                type="button"
                                onClick={() => setMainImage(i)}
                                className="bg-white/90 text-stone-700 text-xs px-2 py-1 rounded-lg font-medium"
                              >
                                ★ Principal
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => removeImage(i)}
                              className="bg-red-500 text-white p-1.5 rounded-lg"
                            >
                              <X size={12} />
                            </button>
                          </div>
                          <p className="text-xs text-stone-300 text-center mt-0.5">
                            {base64Size(img)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Visibilidad */}
              <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-5">
                <h2 className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-4">
                  Visibilidad
                </h2>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-stone-600">
                    {form.isActive
                      ? <Eye size={16} className="text-green-500" />
                      : <EyeOff size={16} className="text-stone-400" />
                    }
                    {form.isActive ? 'Visible en la tienda' : 'Oculto en la tienda'}
                  </div>
                  <button
                    type="button"
                    onClick={() => setField('isActive', !form.isActive)}
                    className={`relative w-11 h-6 rounded-full transition-colors ${
                      form.isActive ? 'bg-green-400' : 'bg-stone-200'
                    }`}
                  >
                    <span
                      className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                        form.isActive ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Botón guardar */}
              <button
                type="submit"
                disabled={isSaving}
                className="w-full flex items-center justify-center gap-2 bg-rose-400 hover:bg-rose-500 text-white py-3.5 rounded-xl font-semibold text-sm transition-colors shadow-sm disabled:opacity-60"
              >
                {isSaving
                  ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  : <Save size={16} />
                }
                {isEdit ? 'Guardar cambios' : 'Crear producto'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
