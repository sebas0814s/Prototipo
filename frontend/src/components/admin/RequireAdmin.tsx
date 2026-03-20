import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../store';
import { ReactNode } from 'react';

/** Protege rutas admin. Redirige a /admin/login si el usuario no es administrador. */
export default function RequireAdmin({ children }: { children: ReactNode }) {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated || user?.role !== 'admin') {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
}
