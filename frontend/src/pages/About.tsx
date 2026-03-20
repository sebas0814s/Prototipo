import { Link } from 'react-router-dom';
import { ArrowRight, Heart, Award, Truck, Wrench } from 'lucide-react';

const TEAM = [
  {
    name: 'Laura Gómez',
    role: 'Fundadora & Diseñadora',
    emoji: '👩‍🎨',
    bio: 'Peluquera profesional por 12 años. Cansada de muebles que no duran, decidió crearlos ella misma.',
  },
  {
    name: 'Andrés Jalac',
    role: 'Maestro Ebanista',
    emoji: '🪚',
    bio: 'Tercera generación de carpinteros. Combina técnicas artesanales con acabados de nivel industrial.',
  },
  {
    name: 'Valentina Ríos',
    role: 'Atención al cliente',
    emoji: '💬',
    bio: 'La voz detrás del WhatsApp. Conoce cada producto de memoria y te ayuda a armar el salón perfecto.',
  },
];

const VALUES = [
  {
    icon: <Heart size={22} className="text-rose-400" />,
    title: 'Hecho con amor',
    desc: 'Cada pieza pasa por control de calidad manual antes de salir de nuestro taller en Medellín.',
  },
  {
    icon: <Award size={22} className="text-rose-400" />,
    title: 'Garantía real',
    desc: '2 años de garantía en estructura y 1 año en tapizados. Sin letras pequeñas, sin excusas.',
  },
  {
    icon: <Truck size={22} className="text-rose-400" />,
    title: 'Entrega a todo Colombia',
    desc: 'Despachamos desde Medellín a cualquier ciudad. Tiempo estimado: 3–7 días hábiles.',
  },
  {
    icon: <Wrench size={22} className="text-rose-400" />,
    title: 'Instalación incluida',
    desc: 'En el Área Metropolitana de Medellín instalamos sin costo adicional. Pregunta por tu ciudad.',
  },
];

const MILESTONES = [
  { year: '2009', text: 'Primer taller artesanal en el barrio Laureles, Medellín.' },
  { year: '2013', text: 'Primeras 100 barberías y peluquerías equipadas.' },
  { year: '2017', text: 'Ampliamos línea: sillas de pedicura, nail spa y lavacabezas.' },
  { year: '2021', text: 'Comenzamos ventas a toda Colombia con envío propio.' },
  { year: '2024', text: 'Más de 500 salones confían en Jalac. Seguimos creciendo.' },
];

export default function About() {
  return (
    <main className="overflow-x-hidden">

      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section
        className="relative py-24 px-4 text-center overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #fff5f7 0%, #ffffff 50%, #fff0f4 100%)' }}
      >
        <div className="absolute top-8 right-12 w-56 h-56 bg-rose-200/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-8 left-12 w-40 h-40 bg-pink-200/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl mx-auto">
          <p className="text-rose-400 text-sm font-semibold uppercase tracking-widest mb-4">Quiénes somos</p>
          <h1 className="text-4xl sm:text-5xl font-bold text-stone-800 leading-tight mb-6">
            Detrás de cada silla<br />
            <span className="text-rose-400">hay una historia</span> 💖
          </h1>
          <p className="text-stone-500 text-lg leading-relaxed">
            Somos un taller familiar de Medellín especializado en mobiliario para peluquerías,
            barberías y nail spas. Llevamos más de 15 años fabricando muebles que aguantan el día a día
            de los salones más exigentes de Colombia.
          </p>
        </div>
      </section>

      {/* ── NUESTRA HISTORIA — línea de tiempo ──────────────────── */}
      <section className="bg-white py-20 px-4 border-y border-rose-100">
        <div className="max-w-3xl mx-auto">
          <p className="text-center text-rose-400 text-sm font-semibold uppercase tracking-widest mb-3">Trayectoria</p>
          <h2 className="text-center text-2xl font-bold text-stone-800 mb-12">Nuestra historia</h2>

          <div className="relative">
            {/* Línea vertical */}
            <div className="absolute left-5 top-0 bottom-0 w-px bg-rose-100 hidden sm:block" />

            <ul className="space-y-8">
              {MILESTONES.map(({ year, text }) => (
                <li key={year} className="flex items-start gap-6">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-rose-400 flex items-center justify-center shadow-sm relative z-10">
                    <span className="text-white font-bold text-xs leading-none text-center">{year.slice(2)}</span>
                  </div>
                  <div className="pt-1.5">
                    <span className="text-rose-400 font-bold text-sm mr-2">{year}</span>
                    <span className="text-stone-600 text-sm">{text}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── VALORES ─────────────────────────────────────────────── */}
      <section className="bg-rose-50/60 py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <p className="text-center text-rose-400 text-sm font-semibold uppercase tracking-widest mb-3">Lo que nos mueve</p>
          <h2 className="text-center text-2xl font-bold text-stone-800 mb-12">Nuestros valores</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {VALUES.map(({ icon, title, desc }) => (
              <div key={title} className="bg-white rounded-2xl p-6 shadow-sm border border-rose-100 flex flex-col gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center">
                  {icon}
                </div>
                <h3 className="font-semibold text-stone-700 text-sm">{title}</h3>
                <p className="text-stone-400 text-xs leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── EQUIPO ──────────────────────────────────────────────── */}
      <section className="bg-white py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <p className="text-center text-rose-400 text-sm font-semibold uppercase tracking-widest mb-3">Las personas</p>
          <h2 className="text-center text-2xl font-bold text-stone-800 mb-12">El equipo Jalac</h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {TEAM.map(({ name, role, emoji, bio }) => (
              <div key={name} className="flex flex-col items-center text-center gap-3">
                <div className="w-20 h-20 rounded-2xl bg-rose-50 border-2 border-rose-100 flex items-center justify-center text-4xl shadow-sm">
                  {emoji}
                </div>
                <div>
                  <p className="font-bold text-stone-700">{name}</p>
                  <p className="text-rose-400 text-xs font-medium">{role}</p>
                </div>
                <p className="text-stone-400 text-sm leading-relaxed">{bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────────── */}
      <section className="bg-gradient-to-r from-rose-400 to-pink-400 py-16 px-4 text-center text-white">
        <div className="max-w-xl mx-auto">
          <span className="text-4xl block mb-4">🏪</span>
          <h2 className="text-2xl font-bold mb-3">¿Listo para equipar tu salón?</h2>
          <p className="text-rose-100 mb-8 text-sm leading-relaxed">
            Explora el catálogo o escríbenos. Te asesoramos sin compromiso.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/products"
              className="inline-flex items-center justify-center gap-2 bg-white text-rose-500 font-semibold px-7 py-3.5 rounded-2xl hover:bg-rose-50 transition-colors shadow-sm"
            >
              Ver catálogo <ArrowRight size={16} />
            </Link>
            <a
              href="https://wa.me/573046251510?text=Hola!%20Vi%20la%20página%20de%20Nosotros%20y%20quiero%20más%20información%20💖"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 border-2 border-white/60 text-white hover:bg-white/10 font-semibold px-7 py-3.5 rounded-2xl transition-colors"
            >
              Escribirnos
            </a>
          </div>
        </div>
      </section>

    </main>
  );
}
