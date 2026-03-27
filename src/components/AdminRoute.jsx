import { Navigate, useLocation } from 'react-router-dom';
import GlassPanel from './GlassPanel';
import { useAuth } from '../context/AuthContext';

export default function AdminRoute({ children }) {
  const { isReady, isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (!isReady) {
    return (
      <div className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <GlassPanel className="rounded-[2.5rem] px-6 py-12 text-center shadow-bloom sm:px-10">
            <p className="font-display text-4xl text-rose-950">Checking admin access...</p>
          </GlassPanel>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    const redirect = `${location.pathname}${location.search}`;
    return <Navigate to={`/auth?redirect=${encodeURIComponent(redirect)}`} replace />;
  }

  if (user?.role !== 'ADMIN') {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
