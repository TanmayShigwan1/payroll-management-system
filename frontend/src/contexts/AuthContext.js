import React, { createContext, useState, useContext, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    const initAuth = async () => {
      const savedToken = localStorage.getItem('token');
      if (savedToken) {
        try {
          authService.setAuthToken(savedToken);
          const userData = await authService.getCurrentUser();
          setCurrentUser(userData);
          setToken(savedToken);
        } catch (error) {
          console.error('Auth initialization failed:', error);
          localStorage.removeItem('token');
          setToken(null);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (username, password) => {
    try {
      const response = await authService.login(username, password);
      const { accessToken, ...userData } = response;
      
      localStorage.setItem('token', accessToken);
      authService.setAuthToken(accessToken);
      setToken(accessToken);
      setCurrentUser(userData);
      
      return response;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    authService.removeAuthToken();
    setToken(null);
    setCurrentUser(null);
    authService.logout();
  };

  const isAuthenticated = () => {
    return !!token && !!currentUser;
  };

  const hasRole = (role) => {
    return currentUser && currentUser.role === role;
  };

  const hasAnyRole = (roles) => {
    return currentUser && roles.includes(currentUser.role);
  };

  const value = {
    currentUser,
    token,
    login,
    logout,
    isAuthenticated,
    hasRole,
    hasAnyRole,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
