import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Scissors, Lock } from 'lucide-react';
import { useAuthStore } from '../../store';
import { userApi } from '../../services/api';
import toast from 'react-hot-toast';

export default function AdminLogin() {
  const navigate = useNavigate();
  const { logout, user: currentUser } = useAuthStore();
  const [email, setEmail]       = useState('admin@jalac.co');
  const [password, setPassword] = useState('');
  const [loading, setLoading]   = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Cerrar cualquier sesión previa antes de intentar login admin
    logout();

    try {
      const response = await userApi.login({ email: email.trim(), password });
      const { user } = response.data.data!;

      if (user.role !== 'admin') {
        toast.error('Ese correo no tiene permisos de administrador');
        setLoading(false);
        return;
      }

      // Actualizar el store directamente con el usuario admin
      useAuthStore.setState({ user, isAuthenticated: true });
      // Forzar actualización en localStorage
      localStorage.setItem('auth-storage', JSON.stringify({ state: { user, isAuthenticated: true }, version: 0 }));

      toast.success(`¡Bienvenido, ${user.firstName}!`);
      navigate('/admin', { replace: true });
    } catch {
      toast.error('Credenciales incorrectas');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-100 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-rose-100 rounded-2xl mb-4">
            <Scissors size={26} className="text-rose-500" />
          </div>
          <h1 className="text-xl font-bold text-stone-800">Panel de administración</h1>
          <p className="text-stone-400 text-sm mt-1">Jalac — Acceso exclusivo</p>
        </div>

        {/* Sesión activa aviso */}
        {currentUser && currentUser.role !== 'admin' && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-4 text-xs text-amber-700">
            Sesión activa como <strong>{currentUser.email}</strong>. Se cerrará al ingresar como admin.
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-stone-600 mb-1.5">
                Correo del administrador
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-stone-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-600 mb-1.5">
                Contraseña
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-stone-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300"
                placeholder="••••••••"
                autoComplete="current-password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-rose-400 hover:bg-rose-500 text-white py-3 rounded-xl font-semibold text-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
            >
              {loading
                ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                : <Lock size={15} />
              }
              Ingresar al panel
            </button>
          </form>

          {/* Hint credenciales demo */}
          <div className="mt-5 p-3 bg-rose-50 rounded-xl border border-rose-100">
            <p className="text-xs text-rose-500 font-semibold mb-1">Credenciales de acceso:</p>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-stone-500 font-mono">admin@jalac.co</p>
                <p className="text-xs text-stone-500 font-mono">jalac2024</p>
              </div>
              <button
                type="button"
                onClick={() => { setEmail('admin@jalac.co'); setPassword('jalac2024'); }}
                className="text-xs bg-rose-100 text-rose-500 px-3 py-1.5 rounded-lg hover:bg-rose-200 transition-colors font-medium"
              >
                Autocompletar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
