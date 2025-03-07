
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
      // If not authenticated, redirect to login
      if (!user) {
        navigate('/', { replace: true, state: { from: location } });
        return;
      }
      
      // If permission required but user doesn't have it, redirect to dashboard
      if (requiredPermission && !hasPermission(requiredPermission)) {
        navigate('/dashboard', { replace: true });
      }
    }
  }, [user, loading, navigate, location, requiredPermission, hasPermission]);

  // Show nothing while loading or redirect in progress
  if (loading || !user) {
    return null;
  }

  // If permission check is required and user doesn't have it, show nothing
  if (requiredPermission && !hasPermission(requiredPermission)) {
    return null;
  }

  // Render children if authenticated and has permission
  return <>{children}</>;
};

export default RequireAuth;
