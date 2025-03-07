
import { ReactNode, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/auth';

interface RequireAuthProps {
  children: ReactNode;
  requiredPermission?: "dashboard" | "reports" | "sales" | "customers" | "products" | "ticketSales" | "rinkManager";
}

const RequireAuth = ({ children, requiredPermission }: RequireAuthProps) => {
  const { user, loading, hasPermission } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading) {
      // Se não estiver autenticado, redireciona para login
      if (!user) {
        navigate('/', { replace: true, state: { from: location } });
        return;
      }
      
      // Se necessitar permissão específica e o usuário não a tem, redireciona para dashboard
      if (requiredPermission && !hasPermission(requiredPermission)) {
        navigate('/dashboard', { replace: true });
      }
    }
  }, [user, loading, location.pathname, requiredPermission]); // Adicionamos location.pathname como dependência e removemos navigate e hasPermission

  // Não mostra nada enquanto está carregando ou redirecionando
  if (loading || !user) {
    return null;
  }

  // Se verificação de permissão é necessária e usuário não a tem, não mostra nada
  if (requiredPermission && !hasPermission(requiredPermission)) {
    return null;
  }

  // Renderiza os filhos se estiver autenticado e tiver permissão
  return <>{children}</>;
};

export default RequireAuth;
