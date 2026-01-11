import React from 'react';
import { Navigate } from 'react-router-dom';
import { getUser } from 'component/ProtectedRoute';

// Guest Route Component - Only allows access when NOT logged in
const GuestRoute = ({ children }) => {
  const authData = getUser();

  // If user is logged in, redirect to their dashboard
  if (authData && authData.user && authData.user.role) {
    const { user } = authData;
    
    if (user.role === 'employer') {
      return <Navigate to="/app/employer/landing" replace />;
    } else if (user.role === 'intern') {
      return <Navigate to="/app/intern" replace />;
    } else {
      return <Navigate to="/app/dashboard" replace />;
    }
  }

  // If not logged in, show the page (login, register, etc.)
  return children;
};

export default GuestRoute;