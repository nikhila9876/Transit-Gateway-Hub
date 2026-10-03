import apiClient, { extractData } from './client';

export const authApi = {
  /**
   * Authenticate user with Spring Boot backend
   * Endpoint: POST /api/auth/login
   * @param {{ username: string, password: string }} credentials
   * @returns {Promise<{ token: string, username: string, role: string, tokenType: string, expiresIn: number }>}
   */
  async login(credentials) {
    const response = await apiClient.post('/auth/login', credentials);
    return extractData(response);
  },

  /**
   * Client-side logout helper (cleans local session storage)
   */
  logout() {
    localStorage.removeItem('cloudnexus_token');
    localStorage.removeItem('cloudnexus_user');
  },

  /**
   * Helper to inspect currently stored token
   */
  getToken() {
    return localStorage.getItem('cloudnexus_token');
  },

  /**
   * Helper to retrieve currently stored user object
   */
  getUser() {
    const raw = localStorage.getItem('cloudnexus_user');
    try {
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },
};

export default authApi;
