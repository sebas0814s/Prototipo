import { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Scissors } from 'lucide-react';
import { useAuthStore } from '../store';
import Button from '../components/common/Button';
import toast from 'react-hot-toast';

export default function Login() {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await login(email, password);
      toast.success('¡Bienvenido a Jalac!');
      navigate('/');
    } catch {
      toast.error('Verifica tus datos e intenta de nuevo');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 bg-rose-50/40">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-2">
            <Scissors size={22} className="text-rose-400" />
            <span className="text-2xl font-bold text-rose-500">Jalac</span>
          </div>
          <p className="text-stone-400 text-sm">Mobiliario para profesionales de la belleza</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-rose-100 p-8">
          <h1 className="text-xl font-bold text-stone-800 mb-1">Iniciar sesión</h1>
          <p className="text-stone-400 text-sm mb-7">
            ¿No tienes cuenta?{' '}
            <Link to="/register" className="text-rose-400 hover:underline font-medium">
              Regístrate aquí
            </Link>
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-stone-600 mb-1.5">Correo electrónico</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-rose-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300"
                placeholder="tu@correo.com"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-600 mb-1.5">Contraseña</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-rose-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300"
                placeholder="••••••••"
              />
            </div>

            <p className="text-xs text-rose-300 bg-rose-50 rounded-lg px-3 py-2">
              Modo demo: ingresa cualquier correo y contraseña.
            </p>

            <Button type="submit" isLoading={isLoading} size="lg" className="w-full mt-1">
              Ingresar
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
