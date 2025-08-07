import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// API base URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Auth context
const AuthContext = createContext();

// Initial state
const initialState = {
  user: null,
  token: localStorage.getItem('token'),
  refreshToken: localStorage.getItem('refreshToken'),
  isLoading: true,
  isAuthenticated: false,
  error: null
};

// Action types
const actionTypes = {
  SET_LOADING: 'SET_LOADING',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGOUT: 'LOGOUT',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  UPDATE_USER: 'UPDATE_USER'
};

// Reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case actionTypes.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload
      };
    
    case actionTypes.LOGIN_SUCCESS:
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        refreshToken: action.payload.refreshToken,
        isAuthenticated: true,
        isLoading: false,
        error: null
      };
    
    case actionTypes.LOGOUT:
      return {
        ...state,
        user: null,
        token: null,
        refreshToken: null,
        isAuthenticated: false,
        isLoading: false,
        error: null
      };
    
    case actionTypes.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        isLoading: false
      };
    
    case actionTypes.CLEAR_ERROR:
      return {
        ...state,
        error: null
      };
    
    case actionTypes.UPDATE_USER:
      return {
        ...state,
        user: { ...state.user, ...action.payload }
      };
    
    default:
      return state;
  }
};

// API helper function
const apiCall = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = localStorage.getItem('token');
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers
    },
    ...options
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'API request failed');
    }
    
    return data;
  } catch (error) {
    throw new Error(error.message || 'Network error');
  }
};

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Load user on mount if token exists
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('token');
      
      if (token) {
        try {
          const response = await apiCall('/auth/me');
          dispatch({
            type: actionTypes.LOGIN_SUCCESS,
            payload: {
              user: response.data.user,
              token: token,
              refreshToken: localStorage.getItem('refreshToken')
            }
          });
        } catch (error) {
          console.error('Failed to load user:', error);
          // Clear invalid token
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
          dispatch({ type: actionTypes.LOGOUT });
        }
      } else {
        dispatch({ type: actionTypes.SET_LOADING, payload: false });
      }
    };

    loadUser();
  }, []);

  // Register user
  const register = async (userData) => {
    dispatch({ type: actionTypes.SET_LOADING, payload: true });
    dispatch({ type: actionTypes.CLEAR_ERROR });

    try {
      const response = await apiCall('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData)
      });

      // Store tokens
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('refreshToken', response.data.refreshToken);

      dispatch({
        type: actionTypes.LOGIN_SUCCESS,
        payload: response.data
      });

      return response;
    } catch (error) {
      dispatch({
        type: actionTypes.SET_ERROR,
        payload: error.message
      });
      throw error;
    }
  };

  // Login user
  const login = async (credentials) => {
    dispatch({ type: actionTypes.SET_LOADING, payload: true });
    dispatch({ type: actionTypes.CLEAR_ERROR });

    try {
      const response = await apiCall('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials)
      });

      // Store tokens
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('refreshToken', response.data.refreshToken);

      dispatch({
        type: actionTypes.LOGIN_SUCCESS,
        payload: response.data
      });

      return response;
    } catch (error) {
      dispatch({
        type: actionTypes.SET_ERROR,
        payload: error.message
      });
      throw error;
    }
  };

  // Logout user
  const logout = async () => {
    try {
      await apiCall('/auth/logout', { method: 'POST' });
    } catch (error) {
      console.error('Logout API call failed:', error);
    } finally {
      // Clear tokens regardless of API call success
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      dispatch({ type: actionTypes.LOGOUT });
    }
  };

  // Update user role
  const updateRole = async (role) => {
    dispatch({ type: actionTypes.SET_LOADING, payload: true });
    dispatch({ type: actionTypes.CLEAR_ERROR });

    try {
      const response = await apiCall('/auth/role', {
        method: 'PUT',
        body: JSON.stringify({ role })
      });

      dispatch({
        type: actionTypes.UPDATE_USER,
        payload: { role: role }
      });

      dispatch({ type: actionTypes.SET_LOADING, payload: false });
      return response;
    } catch (error) {
      dispatch({
        type: actionTypes.SET_ERROR,
        payload: error.message
      });
      throw error;
    }
  };

  // Forgot password
  const forgotPassword = async (email) => {
    dispatch({ type: actionTypes.SET_LOADING, payload: true });
    dispatch({ type: actionTypes.CLEAR_ERROR });

    try {
      const response = await apiCall('/auth/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ email })
      });

      dispatch({ type: actionTypes.SET_LOADING, payload: false });
      return response;
    } catch (error) {
      dispatch({
        type: actionTypes.SET_ERROR,
        payload: error.message
      });
      throw error;
    }
  };

  // Reset password
  const resetPassword = async (token, password) => {
    dispatch({ type: actionTypes.SET_LOADING, payload: true });
    dispatch({ type: actionTypes.CLEAR_ERROR });

    try {
      const response = await apiCall('/auth/reset-password', {
        method: 'POST',
        body: JSON.stringify({ token, password })
      });

      dispatch({ type: actionTypes.SET_LOADING, payload: false });
      return response;
    } catch (error) {
      dispatch({
        type: actionTypes.SET_ERROR,
        payload: error.message
      });
      throw error;
    }
  };

  // Update user profile
  const updateProfile = async (profileData) => {
    dispatch({ type: actionTypes.SET_LOADING, payload: true });
    dispatch({ type: actionTypes.CLEAR_ERROR });

    try {
      const response = await apiCall('/auth/profile', {
        method: 'PUT',
        body: JSON.stringify(profileData)
      });

      // Update user in state
      dispatch({
        type: actionTypes.UPDATE_USER,
        payload: response.data.user
      });

      return response;
    } catch (error) {
      dispatch({
        type: actionTypes.SET_ERROR,
        payload: error.message
      });
      throw error;
    } finally {
      dispatch({ type: actionTypes.SET_LOADING, payload: false });
    }
  };

  // Clear error
  const clearError = () => {
    dispatch({ type: actionTypes.CLEAR_ERROR });
  };

  // Context value
  const value = {
    // State
    user: state.user,
    token: state.token,
    isLoading: state.isLoading,
    isAuthenticated: state.isAuthenticated,
    error: state.error,
    
    // Actions
    register,
    login,
    logout,
    updateRole,
    updateProfile,
    forgotPassword,
    resetPassword,
    clearError,
    
    // Helper computed values
    userRole: state.user?.role,
    isSignedIn: state.isAuthenticated,
    isLoaded: !state.isLoading,

    // Helper to get token (for ApiContext)
    getToken: () => localStorage.getItem('token'),
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// For backward compatibility with useUser hook pattern
export const useUser = () => {
  const auth = useAuth();
  return {
    user: auth.user,
    isLoaded: auth.isLoaded,
    isSignedIn: auth.isSignedIn
  };
};

export default AuthContext; 