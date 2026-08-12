import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, adminOnly = false, technicianOnly = false }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="spinner-wrapper">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  if (technicianOnly && user.role !== 'technician') {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
