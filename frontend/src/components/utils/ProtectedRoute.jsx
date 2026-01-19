import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
const ProtectedRoute = ({ allowedRoles }) => {
  const location = useLocation();
  
  // 1. Get user from Redux Store
  const { user } = useSelector((state) => state.auth);

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  // Authorized? -> Render the child routes
  return <Outlet />;
};

export default ProtectedRoute;