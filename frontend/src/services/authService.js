import authApi from '../api/authApi';
import { isMockMode } from '../utils/config';
import { mockAuthService } from './mockServices';

export const authService = {
  /**
   * Performs authentication via authApi connecting to POST /api/auth/login or mock auth
   * @param {string} username
   * @param {string} password
   * @returns {Promise<{ token: string, username: string, role: string, tokenType: string, expiresIn: number }>}
   */
  async login(username, password) {
    if (isMockMode()) {
      return mockAuthService.login(username, password);
    }
    try {
      const data = await authApi.login({ username, password });
      if (!data || !data.token) {
        throw new Error('Authentication response did not contain a valid JWT token.');
      }
      return data;
    } catch (error) {
      console.warn('Real authentication failed or backend unavailable:', error.message);
      // If backend is down, allow demo fallback login with Admin@123 or Viewer@123
      if (!error.status || error.message.includes('Unable to reach backend')) {
        return mockAuthService.login(username, password);
      }
      const msg = error.message || error.data?.message || 'Authentication failed. Please verify credentials.';
      throw new Error(msg);
    }
  },

  logout() {
    authApi.logout();
    mockAuthService.logout();
  },

  getCurrentUser() {
    const raw = typeof window !== 'undefined' ? localStorage.getItem('cloudnexus_user') : null;
    try {
      if (raw) return JSON.parse(raw);
    } catch {
      // ignore
    }
    if (isMockMode()) {
      return mockAuthService.getCurrentUser();
    }
    return null;
  },

  getToken() {
    const tok = typeof window !== 'undefined' ? localStorage.getItem('cloudnexus_token') : null;
    if (tok) return tok;
    if (isMockMode()) {
      return mockAuthService.getToken();
    }
    return null;
  },

  isAuthenticated() {
    const token = this.getToken();
    if (isMockMode()) return true;
    return !!token && token.trim().length > 0;
  },
};

export default authService;
