import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export function AdminRoute({ children }) {
  const { auth } = useAuth();
  const location = useLocation();

  console.log("ROle admin :" , auth.user?.role);

  if (!auth.isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (auth.user?.role[0].name !== 'ROLE_ADMIN') {
    return <Navigate to="/" replace />;
  }

  return children;
} 