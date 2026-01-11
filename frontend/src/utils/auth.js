// Authentication utilities for frontend

import { getUser, isTokenExpired, logout } from 'component/ProtectedRoute';

// Check if user is authenticated
export const isAuthenticated = () => {
  const authData = getUser();
  
  if (!authData) {
    return false;
  }

  const { user, token } = authData;

  // Check if token is expired
  if (isTokenExpired(token)) {
    logout();
    return false;
  }

  // Check if user data is valid
  if (!user || !user.role || !user._id) {
    logout();
    return false;
  }

  return true;
};

// Get current user
export const getCurrentUser = () => {
  if (!isAuthenticated()) {
    return null;
  }

  const authData = getUser();
  return authData ? authData.user : null;
};

// Get current token
export const getCurrentToken = () => {
  if (!isAuthenticated()) {
    return null;
  }

  const authData = getUser();
  return authData ? authData.token : null;
};

// Check if user has specific role
export const hasRole = (role) => {
  const user = getCurrentUser();
  return user && user.role === role;
};

// Check if user has any of the specified roles
export const hasAnyRole = (roles) => {
  const user = getCurrentUser();
  return user && roles.includes(user.role);
};

// Check if user is employer
export const isEmployer = () => {
  return hasRole('employer');
};

// Check if user is intern
export const isIntern = () => {
  return hasRole('intern');
};

// Redirect to appropriate dashboard based on role
export const redirectToDashboard = () => {
  const user = getCurrentUser();
  
  if (!user) {
    return '/login';
  }

  switch (user.role) {
    case 'employer':
      return '/app/employer/landing';
    case 'intern':
      return '/app/intern';
    default:
      return '/app/dashboard';
  }
};

// Check authentication before API calls
export const checkAuthBeforeApiCall = () => {
  if (!isAuthenticated()) {
    throw new Error('User not authenticated');
  }
  return getCurrentToken();
};

// Role-based access control for components
export const requireAuth = (component, redirectPath = '/login') => {
  if (!isAuthenticated()) {
    window.location.href = redirectPath;
    return null;
  }
  return component;
};

// Role-based access control for specific roles
export const requireRole = (component, requiredRole, redirectPath = null) => {
  if (!isAuthenticated()) {
    window.location.href = '/login';
    return null;
  }

  if (!hasRole(requiredRole)) {
    const dashboardPath = redirectPath || redirectToDashboard();
    window.location.href = dashboardPath;
    return null;
  }

  return component;
};

// Session management
export const refreshAuthState = () => {
  window.dispatchEvent(new Event('userRoleChanged'));
};

// Auto logout on token expiry
export const setupAutoLogout = () => {
  const checkTokenInterval = setInterval(() => {
    const token = getCurrentToken();
    if (token && isTokenExpired(token)) {
      console.log('Token expired, auto logout');
      logout();
      window.location.href = '/login?message=session_expired';
    }
  }, 60000); // Check every minute

  return () => clearInterval(checkTokenInterval);
};

export default {
  isAuthenticated,
  getCurrentUser,
  getCurrentToken,
  hasRole,
  hasAnyRole,
  isEmployer,
  isIntern,
  redirectToDashboard,
  checkAuthBeforeApiCall,
  requireAuth,
  requireRole,
  refreshAuthState,
  setupAutoLogout
};