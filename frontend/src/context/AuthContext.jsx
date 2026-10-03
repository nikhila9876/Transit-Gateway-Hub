import React, { createContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../services/authService';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => authService.getCurrentUser());
  const [token, setToken] = useState(() => authService.getToken());
  const [loading, setLoading] = useState(false);
  const [authMessage, setAuthMessage] = useState(null);

  // Synchronize state if external 401 event is emitted
  const handleUnauthorized = useCallback((e) => {
    authService.logout();
    setUser(null);
    setToken(null);
    setAuthMessage(e?.detail?.message || 'Session expired. Please log in again.');
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.addEventListener('cloudnexus:unauthorized', handleUnauthorized);
      return () => {
        window.removeEventListener('cloudnexus:unauthorized', handleUnauthorized);
      };
    }
  }, [handleUnauthorized]);

  const login = async (username, password) => {
    setLoading(true);
    setAuthMessage(null);
    try {
      const data = await authService.login(username, password);
      // Backend returns role e.g. "ADMIN" or "VIEWER"
      const normalizedRole = (data.role || 'VIEWER').toUpperCase();
      const standardRole = normalizedRole.startsWith('ROLE_') ? normalizedRole : `ROLE_${normalizedRole}`;
      
      const userPayload = {
        username: data.username,
        role: standardRole, // ROLE_ADMIN or ROLE_VIEWER
        rawRole: normalizedRole.replace('ROLE_', ''), // ADMIN or VIEWER
        tokenType: data.tokenType || 'Bearer',
        expiresIn: data.expiresIn,
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
    setAuthMessage(null);
  };

  const isAuthenticated = Boolean(token && user);
  const role = user?.role || (token ? 'ROLE_VIEWER' : null);
  const isAdmin = role === 'ROLE_ADMIN' || user?.rawRole === 'ADMIN';
  const isViewer = role === 'ROLE_VIEWER' || user?.rawRole === 'VIEWER';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        role,
        loading,
        authMessage,
        setAuthMessage,
        login,
        logout,
        isAuthenticated,
        isAdmin,
        isViewer,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
