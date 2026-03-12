import { Navigate } from 'react-router-dom';
import { hasValidToken } from '@/utils/jwt';

export default function ProtectedRoute({ children }) {
  const isValid = hasValidToken();

  // Si no hay token válido, redirigir a login
  if (!isValid) {
    return <Navigate to="/login" replace />;
  }

  // Si hay token válido, renderizar el contenido
  return <>{children}</>;
}
