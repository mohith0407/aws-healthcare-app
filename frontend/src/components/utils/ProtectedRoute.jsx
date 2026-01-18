import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ allowedRoles }) => {
  const { user } = useAuth();

  if (!user) {
    // 1. User not logged in? -> Go to Login
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // 2. User logged in but wrong role? -> Go Home (or 403 Forbidden page)
    return <Navigate to="/" replace />;
  }

  // 3. Authorized? -> Render the child routes
  return <Outlet />;
};

export default ProtectedRoute;