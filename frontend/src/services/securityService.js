import api from './api';
import { MOCK_SECURITY_FINDINGS } from '../data/mockData';

export const securityService = {
  async getFindings() {
    try {
      const response = await api.get('/security');
      return response.data;
    } catch (err) {
      console.warn('Backend unavailable, using MockSecurityService:', err.message);
      return MOCK_SECURITY_FINDINGS;
    }
  }
};
