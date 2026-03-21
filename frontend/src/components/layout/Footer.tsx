import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="bg-stone-900 text-stone-400 mt-20">
      {/* Newsletter */}
      <div className="bg-gradient-to-r from-rose-400 to-pink-400 py-10 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h3 className="text-white font-bold text-xl mb-2">¡No te pierdas nuestras ofertas!</h3>
          <p className="text-rose-100 text-sm mb-5">Suscríbete y recibe descuentos exclusivos en mobiliario profesional</p>
          {subscribed ? (
            <div className="flex items-center justify-center gap-2 text-white font-medium">
              <span className="text-2xl">✨</span>
              <span>¡Gracias por suscribirte! Te contactaremos pronto.</span>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@correo.com"
                required
                className="flex-1 px-4 py-3 rounded-xl text-stone-800 text-sm focus:outline-none focus:ring-2 focus:ring-white"
              />
              <button
                type="submit"
                className="bg-stone-900 hover:bg-stone-800 text-white px-6 py-3 rounded-xl font-semibold text-sm transition-colors"
              >
                Suscribirme
              </button>
            </form>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

          {/* Logo + tagline */}
          <div>
            <img
              src="/logo.png"
              alt="Jalac"
              className="h-12 w-auto mb-4"
              style={{ filter: 'brightness(0) invert(1)', opacity: 0.9 }}
            />
            <p className="text-sm leading-relaxed text-stone-500 mb-4">
              Mobiliario especializado para peluquerías,<br />barberías y spas de uñas.
            </p>
            {/* Redes sociales */}
            <div className="flex gap-3">
              <a href="#" className="w-9 h-9 rounded-full bg-stone-800 hover:bg-rose-400 flex items-center justify-center transition-colors">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" className="text-stone-400">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-stone-800 hover:bg-rose-400 flex items-center justify-center transition-colors">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" className="text-stone-400">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-stone-800 hover:bg-rose-400 flex items-center justify-center transition-colors">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" className="text-stone-400">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </a>
              <a href="https://wa.me/573046251510" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-stone-800 hover:bg-green-500 flex items-center justify-center transition-colors">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" className="text-stone-400">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Navegación */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm">Navegación</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/"         className="hover:text-rose-300 transition-colors">Inicio</Link></li>
              <li><Link to="/products" className="hover:text-rose-300 transition-colors">Catálogo</Link></li>
              <li><Link to="/cart"     className="hover:text-rose-300 transition-colors">Carrito</Link></li>
              <li><Link to="/profile"  className="hover:text-rose-300 transition-colors">Mi cuenta</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm">Legal</h4>
            <ul className="space-y-2.5 text-sm">
              <li><a href="#" className="hover:text-rose-300 transition-colors">Política de Privacidad</a></li>
              <li><a href="#" className="hover:text-rose-300 transition-colors">Términos y Condiciones</a></li>
              <li><a href="#" className="hover:text-rose-300 transition-colors">Política de Devoluciones</a></li>
              <li><a href="#" className="hover:text-rose-300 transition-colors">Política de Envíos</a></li>
            </ul>
          </div>

          {/* Contacto + pagos */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm">Contáctanos</h4>
            <ul className="space-y-2.5 text-sm mb-5">
              <li>
                <a href="https://wa.me/573046251510" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 hover:text-green-400 transition-colors">
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" className="text-green-500">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  +57 304 625 1510
                </a>
              </li>
              <li>info@jalac.co</li>
              <li>Bogotá, Colombia</li>
            </ul>
            {/* Métodos de pago */}
            <div>
              <p className="text-xs text-stone-500 mb-2">Medios de pago</p>
              <div className="flex gap-2 flex-wrap">
                <div className="bg-white rounded px-2 py-1 text-xs font-bold text-blue-600">VISA</div>
                <div className="bg-white rounded px-2 py-1 text-xs font-bold text-red-500">MC</div>
                <div className="bg-white rounded px-2 py-1 text-xs font-bold text-amber-600">AMEX</div>
                <div className="bg-white rounded px-2 py-1 text-xs font-bold text-blue-500">PSE</div>
                <div className="bg-white rounded px-2 py-1 text-xs font-bold text-green-600">Nequi</div>
                <div className="bg-white rounded px-2 py-1 text-xs font-bold text-pink-500">Daviplata</div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-stone-800 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-stone-600">
          <span>© {new Date().getFullYear()} Jalac — Todos los derechos reservados.</span>
          <div className="flex items-center gap-3">
            <span className="text-rose-400/60">Mobiliario para Belleza Profesional</span>
            <span className="text-stone-700">|</span>
            <span>🔒 Pago 100% seguro</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
