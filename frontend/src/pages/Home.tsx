import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { productApi } from '../services/api';
import ProductGrid from '../components/product/ProductGrid';

const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

/* ── Corazones hand-drawn en SVG ──────────────────────────────────────── */
const HeartSVG = ({ color = '#f9a8d4', stroke = '#f43f5e', size = 32 }: { color?: string; stroke?: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 100 90" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M50 82 C50 82 8 55 8 28 C8 14 18 4 30 4 C38 4 46 10 50 18 C54 10 62 4 70 4 C82 4 92 14 92 28 C92 55 50 82 50 82Z"
      fill={color}
      stroke={stroke}
      strokeWidth="4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* líneas interiores estilo hand-drawn */}
    <path d="M35 30 Q40 26 45 30" stroke={stroke} strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.5" />
    <path d="M33 40 Q42 35 48 40" stroke={stroke} strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.4" />
    <path d="M38 50 Q44 46 50 50" stroke={stroke} strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.35" />
  </svg>
);

/* Configuración de corazones flotantes — posiciones fijas para evitar hidratación */
const HEARTS = [
  { size: 24, left: '4%',  delay: '0s',    dur: '9s',  color: '#fda4af', stroke: '#f43f5e' },
  { size: 40, left: '11%', delay: '2.5s',  dur: '12s', color: '#fbcfe8', stroke: '#ec4899' },
  { size: 18, left: '19%', delay: '5s',    dur: '8s',  color: '#f9a8d4', stroke: '#f43f5e' },
  { size: 32, left: '27%', delay: '1s',    dur: '11s', color: '#fecdd3', stroke: '#fb7185' },
  { size: 22, left: '35%', delay: '3.5s',  dur: '9.5s',color: '#fda4af', stroke: '#e11d48' },
  { size: 50, left: '44%', delay: '0.5s',  dur: '14s', color: '#fce7f3', stroke: '#f43f5e', opacity: 0.5 },
  { size: 20, left: '53%', delay: '6s',    dur: '8.5s',color: '#fbcfe8', stroke: '#ec4899' },
  { size: 36, left: '61%', delay: '2s',    dur: '10s', color: '#fda4af', stroke: '#f43f5e' },
  { size: 16, left: '70%', delay: '4s',    dur: '7.5s',color: '#f9a8d4', stroke: '#fb7185' },
  { size: 44, left: '78%', delay: '1.5s',  dur: '13s', color: '#fecdd3', stroke: '#e11d48', opacity: 0.45 },
  { size: 26, left: '86%', delay: '3s',    dur: '9s',  color: '#fbcfe8', stroke: '#f43f5e' },
  { size: 14, left: '93%', delay: '7s',    dur: '8s',  color: '#fda4af', stroke: '#ec4899' },
];

/* ── Marquee items ─────────────────────────────────────────────────── */
const MARQUEE_ITEMS = [
  { icon: '💈', label: 'Sillas de Barbería' },
  { icon: '✂️', label: 'Sillas de Peluquería' },
  { icon: '💅', label: 'Pedicura & Nail Spa' },
  { icon: '🪑', label: 'Mobiliario de Recepción' },
  { icon: '🪞', label: 'Espejos LED Profesionales' },
  { icon: '🛋️', label: 'Salas de Espera' },
  { icon: '⚗️', label: 'Lavacabezas' },
  { icon: '🧴', label: 'Mesas de Manicure' },
];

/* ── Stats ─────────────────────────────────────────────────────────── */
const STATS = [
  { number: '+500', label: 'Salones equipados', sub: 'en toda Colombia' },
  { number: '15+',  label: 'Años de experiencia', sub: 'fabricando calidad' },
  { number: '48h',  label: 'Entrega express', sub: 'ciudades principales' },
  { number: '100%', label: 'Garantía real', sub: 'en todos los productos' },
];

export default function Home() {
  const { data, isLoading } = useQuery({
    queryKey: ['products', 'featured'],
    queryFn: () => productApi.getAll({ limit: 4 }),
  });

  const products = data?.data?.data ?? [];
  const doubled = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS];

  return (
    <main className="overflow-x-hidden">

      {/* ── HERO con corazones flotantes ───────────────────────── */}
      <section
        className="relative min-h-[88vh] flex items-center justify-center overflow-hidden"
        style={{ isolation: 'isolate', background: 'linear-gradient(135deg, #fff5f7 0%, #ffffff 50%, #fff0f4 100%)' }}
      >
        {/* ── Capa 1 (más baja): corazones flotantes ── */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ zIndex: 1, pointerEvents: 'none' }}
        >
          {HEARTS.map((h, i) => (
            <span
              key={i}
              className="heart-float"
              style={{
                left: h.left,
                animationDuration: h.dur,
                animationDelay: h.delay,
                opacity: h.opacity ?? 0.7,
              }}
            >
              <HeartSVG size={h.size} color={h.color} stroke={h.stroke} />
            </span>
          ))}
        </div>

        {/* ── Capa 2: círculos decorativos difuminados ── */}
        <div className="absolute top-10 right-10 w-64 h-64 bg-rose-200/20 rounded-full blur-3xl" style={{ zIndex: 2 }} />
        <div className="absolute bottom-10 left-10 w-48 h-48 bg-pink-200/20 rounded-full blur-3xl" style={{ zIndex: 2 }} />

        {/* ── Capa 3 (más alta): todo el contenido visible ── */}
        <div className="relative text-center max-w-3xl mx-auto px-4" style={{ zIndex: 10 }}>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-stone-800 leading-tight mb-6">
            Equipa tu salón
            <br />
            <span className="text-rose-400">con amor</span>
            <span className="inline-block ml-3 animate-bounce">💖</span>
          </h1>

          <p className="text-stone-500 text-lg mb-10 max-w-xl mx-auto leading-relaxed">
            Sillas de barbería, peluquería, pedicura y nail spa. Diseñadas para profesionales
            que quieren un espacio tan especial como sus clientes.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              to="/products"
              className="group inline-flex items-center gap-2 bg-rose-400 hover:bg-rose-500 text-white px-8 py-4 rounded-2xl font-semibold text-base transition-all shadow-md hover:shadow-rose-200 hover:shadow-lg hover:-translate-y-0.5"
            >
              Ver catálogo
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <a
              href="https://wa.me/573046251510?text=Hola!%20Quiero%20cotizar%20mobiliario%20para%20mi%20sal%C3%B3n%20%F0%9F%92%96"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white border border-green-300 text-green-600 hover:bg-green-50 px-8 py-4 rounded-2xl font-semibold text-base transition-all shadow-sm"
            >
              <WhatsAppIcon />
              Cotizar por WhatsApp
            </a>
          </div>

          {/* Indicador de scroll */}
          <div className="mt-16 flex flex-col items-center gap-2 text-rose-300 text-xs animate-bounce">
            <span>Descubre más</span>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 12L2 6h12L8 12z" />
            </svg>
          </div>
        </div>
      </section>

      {/* ── MARQUEE TICKER ─────────────────────────────────────── */}
      <section className="bg-white border-y border-rose-100 py-0 overflow-hidden">
        <div className="flex items-stretch">
          {/* Etiqueta lateral */}
          <div className="hidden sm:flex items-center px-5 border-r border-rose-100 bg-rose-50 flex-shrink-0">
            <span className="text-xs font-bold text-rose-400 uppercase tracking-widest whitespace-nowrap">
              Especialidades
            </span>
          </div>

          {/* Track infinito */}
          <div className="overflow-hidden flex-1 py-4">
            <div className="marquee-track">
              {doubled.map((item, i) => (
                <Link
                  key={i}
                  to="/products"
                  className="inline-flex items-center gap-2.5 mx-5 px-5 py-2.5 rounded-full bg-rose-50 border border-rose-100
                             text-stone-600 text-sm font-medium whitespace-nowrap
                             hover:bg-rose-400 hover:text-white hover:border-rose-400 transition-colors"
                >
                  <span className="text-base">{item.icon}</span>
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS — generan confianza ──────────────────────────── */}
      <section className="bg-gradient-to-r from-rose-400 to-pink-400 py-14 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center text-white">
            {STATS.map(({ number, label, sub }) => (
              <div key={label} className="flex flex-col items-center gap-1">
                <span className="stat-number text-4xl sm:text-5xl font-bold tracking-tight">
                  {number}
                </span>
                <span className="font-semibold text-sm sm:text-base mt-1">{label}</span>
                <span className="text-rose-100 text-xs">{sub}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRODUCTOS DESTACADOS ────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-rose-400 text-sm font-semibold uppercase tracking-widest mb-2">
              Lo más vendido
            </p>
            <h2 className="text-3xl font-bold text-stone-800 leading-tight">
              Elegidos por los mejores<br className="hidden sm:block" /> salones del país
            </h2>
          </div>
          <Link
            to="/products"
            className="hidden sm:inline-flex items-center gap-1.5 text-rose-400 font-semibold hover:text-rose-500 transition-colors text-sm"
          >
            Ver todo el catálogo <ArrowRight size={15} />
          </Link>
        </div>
        <ProductGrid products={products} isLoading={isLoading} />
        <div className="mt-8 text-center sm:hidden">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 bg-rose-400 text-white px-6 py-3 rounded-xl font-medium hover:bg-rose-500 transition-colors"
          >
            Ver todo el catálogo <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* ── CÓMO FUNCIONA ───────────────────────────────────────── */}
      <section className="bg-rose-50/60 py-16 px-4 border-y border-rose-100">
        <div className="max-w-4xl mx-auto">
          <p className="text-center text-rose-400 text-sm font-semibold uppercase tracking-widest mb-3">Proceso simple</p>
          <h2 className="text-center text-2xl font-bold text-stone-800 mb-12">¿Cómo equipar tu salón con Jalac?</h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Elige tu mobiliario', desc: 'Explora el catálogo y agrega los muebles que necesitas al carrito.' },
              { step: '02', title: 'Confirma tu pedido', desc: 'Completa los datos de entrega y elige tu método de pago preferido.' },
              { step: '03', title: 'Recibe e instala', desc: 'Entregamos en tu local y, si lo necesitas, instalamos sin costo adicional.' },
            ].map(({ step, title, desc }) => (
              <div key={step} className="flex flex-col items-center text-center gap-3">
                <div className="w-14 h-14 rounded-2xl bg-white border-2 border-rose-200 flex items-center justify-center shadow-sm">
                  <span className="text-rose-400 font-bold text-lg">{step}</span>
                </div>
                <h3 className="font-semibold text-stone-700">{title}</h3>
                <p className="text-stone-400 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ──────────────────────────────────────────── */}
      <section className="py-20 px-4 text-center bg-white relative overflow-hidden">
        {/* Corazones decorativos pequeños */}
        <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
          {['10%','25%','42%','58%','74%','90%'].map((left, i) => (
            <span
              key={i}
              className="absolute text-rose-100"
              style={{ left, top: `${20 + (i % 3) * 20}%`, fontSize: `${24 + i * 8}px` }}
            >
              ♥
            </span>
          ))}
        </div>

        <div className="relative z-10 max-w-2xl mx-auto">
          <span className="text-4xl mb-4 block">💖</span>
          <h2 className="text-3xl font-bold text-stone-800 mb-4">
            ¿Listo para transformar tu espacio?
          </h2>
          <p className="text-stone-500 mb-8 leading-relaxed">
            Más de 500 peluquerías, barberías y nail spas ya confían en Jalac.
            Cuéntanos tu proyecto y te asesoramos gratis.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/products"
              className="inline-flex items-center justify-center gap-2 bg-rose-400 hover:bg-rose-500 text-white px-8 py-4 rounded-2xl font-semibold transition-all shadow-md hover:shadow-rose-200 hover:shadow-lg hover:-translate-y-0.5"
            >
              Explorar catálogo <ArrowRight size={18} />
            </Link>
            <a
              href="https://wa.me/573046251510?text=Hola!%20Me%20interesa%20conocer%20más%20sobre%20el%20mobiliario%20para%20mi%20salón%20%F0%9F%92%96"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 border-2 border-green-300 text-green-600 hover:bg-green-50 px-8 py-4 rounded-2xl font-semibold transition-colors"
            >
              <WhatsAppIcon />
              Hablar con un asesor
            </a>
          </div>
        </div>
      </section>

    </main>
  );
}
