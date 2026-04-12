import { Navigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import Spinner from '../ui/Spinner';

const GuestOnlyRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <Spinner fullScreen />;
  if (isAuthenticated) return <Navigate to="/" replace />;

  return children;
};

export default GuestOnlyRoute;
