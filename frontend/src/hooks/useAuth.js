import { useState, useEffect } from 'react';
import { getUser, isTokenExpired, logout } from 'component/ProtectedRoute';

// Custom hook for authentication state
export const useAuthState = () => {
  const [authState, setAuthState] = useState({
    user: null,
    token: null,
    isAuthenticated: false,
    loading: true
  });

  useEffect(() => {
    const checkAuthState = () => {
      const authData = getUser();
      
      if (!authData) {
        setAuthState({
          user: null,
          token: null,
          isAuthenticated: false,
          loading: false
        });
        return;
      }

      const { user, token } = authData;

      // Check if token is expired
      if (isTokenExpired(token)) {
        logout();
        setAuthState({
          user: null,
          token: null,
          isAuthenticated: false,
          loading: false
        });
        return;
      }

      // Check if user data is valid
      if (!user || !user.role || !user._id) {
        logout();
        setAuthState({
          user: null,
          token: null,
          isAuthenticated: false,
          loading: false
        });
        return;
      }

      setAuthState({
        user,
        token,
        isAuthenticated: true,
        loading: false
      });
    };

    checkAuthState();

    // Listen for auth changes
    const handleAuthChange = () => checkAuthState();
    window.addEventListener('userRoleChanged', handleAuthChange);
    
    return () => {
      window.removeEventListener('userRoleChanged', handleAuthChange);
    };
  }, []);

  return authState;
};

// Custom hook for checking if user has specific role
export const useRole = (requiredRole) => {
  const { user, isAuthenticated } = useAuthState();
  return isAuthenticated && user && user.role === requiredRole;
};

// Custom hook for checking if user has any of specified roles
export const useRoles = (requiredRoles) => {
  const { user, isAuthenticated } = useAuthState();
  return isAuthenticated && user && requiredRoles.includes(user.role);
};

// Custom hook for getting user data
export const useUser = () => {
  const { user, isAuthenticated } = useAuthState();
  return isAuthenticated ? user : null;
};

// Custom hook for checking employer role
export const useIsEmployer = () => {
  return useRole('employer');
};

// Custom hook for checking intern role
export const useIsIntern = () => {
  return useRole('intern');
};

export default useAuthState;