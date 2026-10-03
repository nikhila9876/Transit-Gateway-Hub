import api from './api';

export const authService = {
  async login(username, password) {
    try {
      const response = await api.post('/auth/login', { username, password });
      return response.data;
    } catch (error) {
      // Mock fallback for offline or standalone frontend testing
      if (
        (username === 'admin' && password === 'Admin@123') ||
        (username === 'viewer' && password === 'Viewer@123')
      ) {
        const role = username === 'admin' ? 'ROLE_ADMIN' : 'ROLE_VIEWER';
        const mockAuth = {
          token: 'mock-jwt-token-cloudnexus-session',
          username,
          role,
          tokenType: 'Bearer',
          expiresIn: 86400000
        };
        return mockAuth;
      }
      throw error.response?.data?.message || 'Invalid username or password';
    }
  },

  logout() {
    localStorage.removeItem('cloudnexus_token');
    localStorage.removeItem('cloudnexus_user');
  },

  getCurrentUser() {
    const userJson = localStorage.getItem('cloudnexus_user');
    return userJson ? JSON.parse(userJson) : null;
  },

  getToken() {
    return localStorage.getItem('cloudnexus_token');
  },

  isAuthenticated() {
    return !!localStorage.getItem('cloudnexus_token');
  }
};
