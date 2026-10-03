import React, { createContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => authService.getCurrentUser());
  const [token, setToken] = useState(() => authService.getToken());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // If token exists but user not loaded, hydrate default
    if (token && !user) {
      const stored = authService.getCurrentUser();
      if (stored) {
        setUser(stored);
      }
    }
  }, [token, user]);

  const login = async (username, password) => {
    setLoading(true);
    try {
      const data = await authService.login(username, password);
      const userPayload = {
        username: data.username,
        role: data.role || 'ROLE_ADMIN'
      };
      localStorage.setItem('cloudnexus_token', data.token);
      localStorage.setItem('cloudnexus_user', JSON.stringify(userPayload));
      setToken(data.token);
      setUser(userPayload);
      return userPayload;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setToken(null);
  };

  const isAuthenticated = !!token;
  const isAdmin = user?.role === 'ROLE_ADMIN';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        logout,
        isAuthenticated,
        isAdmin
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
