import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

interface AdminRouteProps {
  children: React.ReactNode;
}

export const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { user, appUser, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#03060C] flex flex-col items-center justify-center">
        <div className="w-12 h-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
        <div className="mt-4 text-textMuted text-sm font-medium animate-pulse">Checking credentials...</div>
      </div>
    );
  }

  // Not logged in? Redirect to landing/login page
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // Check if role is admin or instructor
  const role = appUser?.role;
  if (role !== 'admin' && role !== 'instructor') {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
