import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';

// Get user from localStorage
const getUser = () => {
  try {
    const userStr = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (userStr && token) {
      return { user: JSON.parse(userStr), token };
    }
  } catch (error) {
    console.error('Error getting user:', error);
    // Clear corrupted data
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  }
  return null;
};

// Check token validity
const isTokenExpired = (token) => {
  if (!token) return true;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Date.now() / 1000;
    return payload.exp < currentTime;
  } catch (error) {
    console.error('Error checking token:', error);
    return true;
  }
};

// Logout function
const logout = () => {
  localStorage.removeItem('user');
  localStorage.removeItem('token');
  localStorage.removeItem('googleUser');
  window.dispatchEvent(new Event('userRoleChanged'));
};

// Loading Component
const LoadingScreen = () => (
  <Box
    sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      flexDirection: 'column',
      gap: 2
    }}
  >
    <CircularProgress size={40} />
    <Box>Authenticating...</Box>
  </Box>
);

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const [loading, setLoading] = useState(true);
  const [authData, setAuthData] = useState(null);

  useEffect(() => {
    const checkAuth = () => {
      const data = getUser();
      
      if (!data) {
        setLoading(false);
        return;
      }

      const { user, token } = data;

      // Check if token is expired
      if (isTokenExpired(token)) {
        console.log('Token expired, logging out');
        logout();
        setLoading(false);
        return;
      }

      // Check if user data is valid
      if (!user || !user.role || !user._id) {
        console.log('Invalid user data, logging out');
        logout();
        setLoading(false);
        return;
      }

      setAuthData({ user, token });
      setLoading(false);
    };

    checkAuth();

    // Listen for auth changes
    const handleAuthChange = () => checkAuth();
    window.addEventListener('userRoleChanged', handleAuthChange);
    
    return () => {
      window.removeEventListener('userRoleChanged', handleAuthChange);
    };
  }, []);

  // Show loading while checking authentication
  if (loading) {
    return <LoadingScreen />;
  }

  // If no valid auth data, redirect to login
  if (!authData || !authData.user || !authData.user.role) {
    return <Navigate to="/login" replace />;
  }

  const { user } = authData;

  // Check if user account is active
  if (user.isActive === false) {
    logout();
    return <Navigate to="/login?message=account_deactivated" replace />;
  }

  // If user role is not in allowed roles, redirect to their dashboard
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    // Redirect to appropriate dashboard based on role
    if (user.role === 'employer') {
      return <Navigate to="/app/employer/landing" replace />;
    } else if (user.role === 'intern') {
      return <Navigate to="/app/intern" replace />;
    } else {
      return <Navigate to="/app/dashboard" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
export { getUser, logout, isTokenExpired };