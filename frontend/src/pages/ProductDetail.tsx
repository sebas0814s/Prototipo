import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, ShoppingCart, Ruler, ZoomIn, X } from 'lucide-react';
import { useState } from 'react';
import { productApi } from '../services/api';
import { useCartStore } from '../store';
import Button from '../components/common/Button';
import toast from 'react-hot-toast';

const MATERIAL_LABELS: Record<string, string> = {
  wood: 'Madera', metal: 'Acero', glass: 'Vidrio',
  fabric: 'Tela', leather: 'Cuero', mixed: 'Mixto',
};

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding]     = useState(false);
  const [activeImg, setActiveImg] = useState(0);
  const [lightbox, setLightbox]  = useState(false);
  const addItem = useCartStore((s) => s.addItem);

  const { data, isLoading } = useQuery({
    queryKey: ['product', id],
    queryFn: () => productApi.getById(id!),
    enabled: !!id,
  });

  const product = data?.data?.data;

  const handleAddToCart = async () => {
    if (!product) return;
    setAdding(true);
    try {
      await addItem({
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity,
        imageUrl: product.images[0] ?? '',
      });
      toast.success('¡Agregado al carrito!');
    } catch {
      toast.error('Error al agregar al carrito');
    } finally {
      setAdding(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="aspect-square bg-rose-50 rounded-2xl animate-pulse" />
          <div className="space-y-4 pt-4">
            <div className="h-6 bg-rose-50 rounded animate-pulse w-1/3" />
            <div className="h-8 bg-rose-50 rounded animate-pulse w-3/4" />
            <div className="h-4 bg-rose-50 rounded animate-pulse" />
            <div className="h-4 bg-rose-50 rounded animate-pulse w-5/6" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-32 text-stone-400">
        <p className="text-xl">Producto no encontrado</p>
        <Link to="/products" className="text-rose-400 mt-4 inline-block hover:underline">
          Volver al catálogo
        </Link>
      </div>
    );
  }

  const formattedPrice = new Intl.NumberFormat('es-CO', {
    style: 'currency', currency: 'COP', maximumFractionDigits: 0,
  }).format(product.price);

  const images = product.images.length > 0 ? product.images : [];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

      {/* Lightbox — imagen a pantalla completa */}
      {lightbox && images[activeImg] && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setLightbox(false)}
        >
          <button
            className="absolute top-4 right-4 text-white/70 hover:text-white p-2"
            onClick={() => setLightbox(false)}
          >
            <X size={28} />
          </button>
          <img
            src={images[activeImg]}
            alt={product.name}
            className="max-w-full max-h-full object-contain rounded-xl"
            onClick={(e) => e.stopPropagation()}
          />
          {images.length > 1 && (
            <div className="absolute bottom-4 flex gap-2">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={(e) => { e.stopPropagation(); setActiveImg(i); }}
                  className={`w-2.5 h-2.5 rounded-full transition-colors ${i === activeImg ? 'bg-white' : 'bg-white/40'}`}
                />
              ))}
            </div>
          )}
        </div>
      )}

      <Link
        to="/products"
        className="inline-flex items-center gap-2 text-stone-400 hover:text-rose-500 transition-colors mb-8 text-sm"
      >
        <ArrowLeft size={16} /> Volver al catálogo
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

        {/* ── Galería ── */}
        <div className="space-y-3">
          {/* Imagen principal — se adapta a la proporción real de la foto */}
          <div className="relative group bg-rose-50 rounded-2xl overflow-hidden">
            {images[activeImg] ? (
              <>
                <img
                  src={images[activeImg]}
                  alt={product.name}
                  className="w-full h-auto object-contain max-h-[520px] mx-auto block"
                  style={{ background: '#fff8f8' }}
                />
                {/* Botón zoom */}
                <button
                  onClick={() => setLightbox(true)}
                  className="absolute top-3 right-3 bg-white/80 backdrop-blur text-stone-600 hover:text-rose-500
                             p-2 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                >
                  <ZoomIn size={18} />
                </button>
              </>
            ) : (
              <div className="w-full h-72 flex items-center justify-center text-rose-200 text-6xl">✂️</div>
            )}
          </div>

          {/* Miniaturas */}
          {images.length > 1 && (
            <div className="flex gap-2 flex-wrap">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={`relative overflow-hidden rounded-xl border-2 transition-all flex-shrink-0 ${
                    i === activeImg
                      ? 'border-rose-400 shadow-md shadow-rose-100'
                      : 'border-transparent hover:border-rose-200'
                  }`}
                  style={{ width: 72, height: 72 }}
                >
                  <img
                    src={img}
                    alt={`${product.name} ${i + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── Info del producto ── */}
        <div className="flex flex-col gap-5">
          <div>
            <span className="text-xs font-medium bg-rose-100 text-rose-500 px-3 py-1 rounded-full">
              {MATERIAL_LABELS[product.material] ?? product.material}
            </span>
            <h1 className="text-2xl font-bold text-stone-800 mt-3 leading-snug">
              {product.name}
            </h1>
            <p className="text-stone-500 mt-3 leading-relaxed text-sm">
              {product.description}
            </p>
          </div>

          {/* Dimensiones */}
          {(product.dimensions.widthCm > 0 || product.dimensions.heightCm > 0) && (
            <div className="flex items-start gap-2 text-xs text-stone-400 bg-rose-50 rounded-xl p-4">
              <Ruler size={14} className="text-rose-400 mt-0.5 flex-shrink-0" />
              <span>
                {product.dimensions.widthCm} cm (ancho) ×{' '}
                {product.dimensions.heightCm} cm (alto) ×{' '}
                {product.dimensions.depthCm} cm (fondo)
              </span>
            </div>
          )}

          {/* Precio */}
          <div>
            <p className="text-4xl font-bold text-rose-500">{formattedPrice}</p>
            <p className={`text-xs mt-1.5 font-medium ${product.stock > 0 ? 'text-green-500' : 'text-red-400'}`}>
              {product.stock > 0
                ? `✓ ${product.stock} unidades disponibles`
                : '✗ Agotado temporalmente'}
            </p>
          </div>

          {/* Selector de cantidad + botón */}
          <div className="flex items-center gap-3">
            <div className="flex items-center border border-rose-200 rounded-xl overflow-hidden bg-rose-50/50">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-4 py-3 hover:bg-rose-100 transition-colors text-stone-500"
              >
                −
              </button>
              <span className="px-4 py-3 font-semibold text-stone-700 min-w-[2.5rem] text-center">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                className="px-4 py-3 hover:bg-rose-100 transition-colors text-stone-500"
              >
                +
              </button>
            </div>

            <Button
              onClick={handleAddToCart}
              disabled={!product.stock}
              isLoading={adding}
              size="lg"
              className="flex-1"
            >
              <ShoppingCart size={18} />
              Agregar al carrito
            </Button>
          </div>

          {/* WhatsApp para consulta */}
          <a
            href={`https://wa.me/573046251510?text=Hola!%20Me%20interesa%20el%20producto%20*${encodeURIComponent(product.name)}*%20%F0%9F%92%96`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 border-2 border-green-200 text-green-600 hover:bg-green-50 py-3 rounded-xl text-sm font-medium transition-colors"
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Consultar por WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
