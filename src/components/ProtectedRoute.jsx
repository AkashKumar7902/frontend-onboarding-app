import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = () => {
  // Use our custom hook to get the authentication status.
  const { isAuthenticated } = useAuth();

  // If the user is not authenticated, redirect them to the /login page.
  // The 'replace' prop prevents the user from using the back button to go
  // back to the protected page they were just kicked out of.
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If the user is authenticated, render the child route's component.
  // <Outlet /> is a placeholder provided by react-router-dom that will be
  // replaced by the actual page component (e.g., <DashboardPage />).
  return <Outlet />;
};

export default ProtectedRoute;
