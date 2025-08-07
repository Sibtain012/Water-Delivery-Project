import React, { useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { Navigate } from 'react-router-dom';

const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAdmin, checkSession } = useAuthStore();
  
  useEffect(() => {
    // Check session validity on each route access
    checkSession();
  }, [checkSession]);

  const isValidSession = checkSession();

  return isValidSession && isAdmin ? (
    <>{children}</>
  ) : (
    <Navigate to="/admin-login" />
  );
};

export default AdminRoute;

