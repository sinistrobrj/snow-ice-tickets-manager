
import { ReactNode, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

interface RequireAuthProps {
  children: ReactNode;
}

const RequireAuth = ({ children }: RequireAuthProps) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading && !user) {
      // Redirect to login page with return URL
      navigate('/', { replace: true, state: { from: location } });
    }
  }, [user, loading, navigate, location]);

  // Show nothing while loading or redirect in progress
  if (loading || !user) {
    return null;
  }

  // Render children if authenticated
  return <>{children}</>;
};

export default RequireAuth;
