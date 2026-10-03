import authApi from '../api/authApi';

export const authService = {
  /**
   * Performs authentication via authApi connecting to POST /api/auth/login
   * @param {string} username
   * @param {string} password
   * @returns {Promise<{ token: string, username: string, role: string, tokenType: string, expiresIn: number }>}
   */
  async login(username, password) {
    try {
      const data = await authApi.login({ username, password });
      if (!data || !data.token) {
        throw new Error('Authentication response did not contain a valid JWT token.');
      }
      return data;
    } catch (error) {
      const msg = error.message || error.data?.message || 'Authentication failed. Please verify credentials.';
      throw new Error(msg);
    }
  },

  logout() {
    authApi.logout();
  },

  getCurrentUser() {
    const raw = localStorage.getItem('cloudnexus_user');
    try {
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },

  getToken() {
    return localStorage.getItem('cloudnexus_token');
  },

  isAuthenticated() {
    const token = this.getToken();
    return !!token && token.trim().length > 0;
  },
};

export default authService;
