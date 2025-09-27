import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: 'admin' | 'user';
  redirectTo?: string;
}

export const ProtectedRoute = ({
  children,
  requiredRole = 'user',
  redirectTo = '/login',
}: ProtectedRouteProps) => {
  const { isAuthenticated, user, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>; // Or a loading spinner
  }

  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  // Check if user has the required role
  if (requiredRole === 'admin' && user?.role !== 'admin') {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

export const AdminRoute = ({
  children,
  redirectTo = '/login',
}: Omit<ProtectedRouteProps, 'requiredRole'>) => (
  <ProtectedRoute requiredRole="admin" redirectTo={redirectTo}>
    {children}
  </ProtectedRoute>
);
