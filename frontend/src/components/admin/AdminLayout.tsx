import { ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, LogOut, Scissors, ExternalLink } from 'lucide-react';
import { useAuthStore } from '../../store';

interface AdminLayoutProps { children: ReactNode }

export default function AdminLayout({ children }: AdminLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const user     = useAuthStore((s) => s.user);
  const logout   = useAuthStore((s) => s.logout);

  const handleLogout = () => {
    logout();
    navigate('/', { replace: true });
  };

  const isActive = (path: string) =>
    path === '/admin'
      ? location.pathname === '/admin'
      : location.pathname.startsWith(path);

  const linkClass = (path: string) =>
    `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
      isActive(path)
        ? 'bg-rose-100 text-rose-600'
        : 'text-stone-500 hover:bg-stone-50 hover:text-stone-700'
    }`;

  return (
    <div className="min-h-screen flex bg-stone-100">

      {/* ── Sidebar ── */}
      <aside className="w-56 bg-white border-r border-stone-200 flex flex-col shadow-sm flex-shrink-0 min-h-screen">

        {/* Logo */}
        <div className="px-5 py-4 border-b border-stone-100 flex items-center gap-2">
          <Scissors size={17} className="text-rose-400" />
          <span className="font-bold text-stone-800">Jalac</span>
          <span className="ml-auto text-xs bg-rose-100 text-rose-500 font-bold px-2 py-0.5 rounded-full">Admin</span>
        </div>

        {/* Navegación */}
        <nav className="flex-1 px-3 py-5 space-y-1">
          <Link to="/admin" className={linkClass('/admin')}>
            <LayoutDashboard size={17} />
            Dashboard
          </Link>

          <Link to="/admin/products" className={linkClass('/admin/products')}>
            <Package size={17} />
            Productos
          </Link>
        </nav>

        {/* Footer sidebar */}
        <div className="px-3 py-4 border-t border-stone-100 space-y-1">
          <Link
            to="/"
            target="_blank"
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-stone-400 hover:bg-stone-50 hover:text-stone-600 transition-colors"
          >
            <ExternalLink size={13} /> Ver tienda
          </Link>

          <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-rose-50 mt-1">
            <div className="w-7 h-7 bg-rose-400 rounded-full flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
              {user?.firstName?.[0]?.toUpperCase() ?? 'A'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-stone-700 truncate">{user?.firstName} {user?.lastName}</p>
              <p className="text-xs text-stone-400 truncate">{user?.email}</p>
            </div>
            <button
              onClick={handleLogout}
              title="Cerrar sesión"
              className="text-stone-300 hover:text-red-400 transition-colors flex-shrink-0"
            >
              <LogOut size={15} />
            </button>
          </div>
        </div>
      </aside>

      {/* ── Contenido ── */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
