import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../../contexts/AuthContext';
import Spinner from '../ui/Spinner';

const AdminRoute = ({ children }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  const [shouldRedirect, setShouldRedirect] = useState(false);

  const isAccessDenied = !loading && isAuthenticated && !isAdmin;

  useEffect(() => {
    if (!isAccessDenied) return;

    toast.error('Admin access required');
    const timer = setTimeout(() => setShouldRedirect(true), 2000);
    return () => clearTimeout(timer);
  }, [isAccessDenied]);

  if (loading) return <Spinner fullScreen />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  if (isAccessDenied && !shouldRedirect) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
        <div className="rounded-lg border border-red-200 bg-red-50 p-8 dark:border-red-800 dark:bg-red-900/20">
          <h2 className="text-xl font-semibold text-red-600 dark:text-red-400">
            Access Denied
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            You don&apos;t have permission to access this page.
          </p>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-500">
            Redirecting to home page...
          </p>
        </div>
      </div>
    );
  }

  if (isAccessDenied && shouldRedirect) return <Navigate to="/" replace />;

  return children;
};

export default AdminRoute;
