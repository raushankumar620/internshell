import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { getUser, logout, isTokenExpired } from 'component/ProtectedRoute';

// Auth Actions
const AUTH_ACTIONS = {
  LOGIN: 'LOGIN',
  LOGOUT: 'LOGOUT',
  LOADING: 'LOADING',
  CHECK_AUTH: 'CHECK_AUTH'
};

// Initial State
const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: true
};

// Auth Reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case AUTH_ACTIONS.LOADING:
      return {
        ...state,
        loading: action.payload
      };
    
    case AUTH_ACTIONS.LOGIN:
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        loading: false
      };
    
    case AUTH_ACTIONS.LOGOUT:
      return {
        ...initialState,
        loading: false
      };
    
    case AUTH_ACTIONS.CHECK_AUTH:
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: action.payload.isAuthenticated,
        loading: false
      };
    
    default:
      return state;
  }
};

// Auth Context
const AuthContext = createContext(null);

// Auth Provider
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = () => {
      dispatch({ type: AUTH_ACTIONS.LOADING, payload: true });
      
      const authData = getUser();
      
      if (!authData) {
        dispatch({ type: AUTH_ACTIONS.CHECK_AUTH, payload: { user: null, token: null, isAuthenticated: false } });
        return;
      }

      const { user, token } = authData;

      // Check if token is expired
      if (isTokenExpired(token)) {
        console.log('Token expired during auth check');
        logout();
        dispatch({ type: AUTH_ACTIONS.CHECK_AUTH, payload: { user: null, token: null, isAuthenticated: false } });
        return;
      }

      // Check if user data is valid
      if (!user || !user.role || !user._id) {
        console.log('Invalid user data during auth check');
        logout();
        dispatch({ type: AUTH_ACTIONS.CHECK_AUTH, payload: { user: null, token: null, isAuthenticated: false } });
        return;
      }

      dispatch({ type: AUTH_ACTIONS.CHECK_AUTH, payload: { user, token, isAuthenticated: true } });
    };

    checkAuth();

    // Listen for auth changes
    const handleAuthChange = () => checkAuth();
    window.addEventListener('userRoleChanged', handleAuthChange);
    
    return () => {
      window.removeEventListener('userRoleChanged', handleAuthChange);
    };
  }, []);

  // Login function
  const login = (userData, token) => {
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', token);
    dispatch({ 
      type: AUTH_ACTIONS.LOGIN, 
      payload: { user: userData, token } 
    });
    window.dispatchEvent(new Event('userRoleChanged'));
  };

  // Logout function
  const logoutUser = () => {
    logout(); // Use the imported logout function
    dispatch({ type: AUTH_ACTIONS.LOGOUT });
  };

  // Check if user has role
  const hasRole = (role) => {
    return state.user && state.user.role === role;
  };

  // Check if user has any of the roles
  const hasAnyRole = (roles) => {
    return state.user && roles.includes(state.user.role);
  };

  // Get user role
  const getUserRole = () => {
    return state.user ? state.user.role : null;
  };

  const value = {
    ...state,
    login,
    logout: logoutUser,
    hasRole,
    hasAnyRole,
    getUserRole
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;