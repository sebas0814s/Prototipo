import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, LogOut, Menu, X, LayoutDashboard, Sun, Moon, Heart } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuthStore, useCartStore, useThemeStore, useWishlistStore, useCartAnimationStore } from '../../store';
import SearchDropdown from './SearchDropdown';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled]  = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, logout, user } = useAuthStore();
  const { cart, fetchCart } = useCartStore();
  const { isDark, toggleTheme } = useThemeStore();
  const { items: wishlistItems } = useWishlistStore();
  const bouncing = useCartAnimationStore((s) => s.bouncing);
  const isAdmin    = user?.role === 'admin';
  const totalUnits = cart?.totalUnits ?? 0;
  const wishlistCount = wishlistItems.length;

  useEffect(() => { fetchCart(); }, [fetchCart]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <nav className={`sticky top-0 z-50 bg-white dark:bg-stone-900 transition-shadow duration-200 ${scrolled ? 'shadow-md border-b border-rose-100 dark:border-stone-700' : 'border-b border-rose-100 dark:border-stone-700'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* ── Logo ── */}
          <Link to="/" className="flex items-center">
            <img
              src="/logo.png"
              alt="Jalac"
              className="h-14 w-auto mix-blend-multiply dark:mix-blend-normal dark:brightness-110"
            />
          </Link>

          {/* ── Navegación desktop ── */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-stone-500 dark:text-stone-300">
            <Link to="/"         className="hover:text-rose-400 transition-colors">Inicio</Link>
            <Link to="/products" className="hover:text-rose-400 transition-colors">Catálogo</Link>
            <Link to="/about"    className="hover:text-rose-400 transition-colors">Nosotros</Link>
          </div>

          {/* ── Acciones ── */}
          <div className="flex items-center gap-2">

            {/* Búsqueda */}
            <SearchDropdown />

            {/* Favoritos */}
            <Link
              to="/wishlist"
              className="relative p-2 text-stone-400 dark:text-stone-400 hover:text-rose-400 transition-colors"
            >
              <Heart size={20} />
              {wishlistCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-pink-400 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center font-bold leading-none">
                  {wishlistCount > 9 ? '9+' : wishlistCount}
                </span>
              )}
            </Link>

            {/* Dark mode toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 text-stone-400 dark:text-stone-400 hover:text-rose-400 transition-colors rounded-lg hover:bg-rose-50 dark:hover:bg-stone-700"
              title={isDark ? 'Modo claro' : 'Modo oscuro'}
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {/* Carrito */}
            <Link to="/cart" className="relative p-2 text-stone-400 dark:text-stone-400 hover:text-rose-400 transition-colors">
              <ShoppingCart size={21} className={bouncing ? 'cart-bounce' : ''} />
              {totalUnits > 0 && (
                <span className={`absolute -top-0.5 -right-0.5 bg-rose-400 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center font-bold leading-none ${bouncing ? 'cart-bounce' : ''}`}>
                  {totalUnits > 9 ? '9+' : totalUnits}
                </span>
              )}
            </Link>

            {isAuthenticated ? (
              <div className="flex items-center gap-1">
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="hidden sm:flex items-center gap-1.5 text-xs font-semibold bg-rose-50 text-rose-500 hover:bg-rose-100 px-3 py-1.5 rounded-lg transition-colors border border-rose-200 dark:border-rose-800/60 dark:bg-rose-950/40 dark:text-rose-300 dark:hover:bg-rose-900/50"
                  >
                    <LayoutDashboard size={12} /> Admin
                  </Link>
                )}
                <Link to="/profile" className="p-2 text-stone-400 dark:text-stone-400 hover:text-rose-400 transition-colors">
                  <User size={21} />
                </Link>
                <button onClick={handleLogout} className="p-2 text-stone-300 dark:text-stone-500 hover:text-red-400 transition-colors">
                  <LogOut size={19} />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="bg-rose-400 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-rose-500 transition-colors shadow-sm"
              >
                Ingresar
              </Link>
            )}

            {/* Hamburguesa mobile */}
            <button className="md:hidden p-2 text-stone-400 dark:text-stone-400" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* ── Menú mobile ── */}
      {menuOpen && (
        <div className="md:hidden bg-white dark:bg-stone-900 border-t border-rose-50 dark:border-stone-700 px-6 py-5 flex flex-col gap-4 text-sm font-medium text-stone-500 dark:text-stone-300">
          <Link to="/"         onClick={() => setMenuOpen(false)} className="hover:text-rose-400">Inicio</Link>
          <Link to="/products" onClick={() => setMenuOpen(false)} className="hover:text-rose-400">Catálogo</Link>
          <Link to="/about"    onClick={() => setMenuOpen(false)} className="hover:text-rose-400">Nosotros</Link>
          {isAdmin && (
            <Link to="/admin"  onClick={() => setMenuOpen(false)} className="text-rose-400 font-semibold">Panel Admin</Link>
          )}
        </div>
      )}
    </nav>
  );
}
