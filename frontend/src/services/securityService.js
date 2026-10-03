import api from './api';
import { MOCK_SECURITY_FINDINGS } from '../data/mockData';

export const securityService = {
  async getFindings() {
    try {
      const response = await api.get('/security');
      const payload = response.data;
      const list = payload?.data ?? payload?.findings ?? payload;
      if (Array.isArray(list)) {
        return list;
      }
      return MOCK_SECURITY_FINDINGS;
    } catch (err) {
      console.warn('Backend unavailable, using MockSecurityService:', err.message);
      return MOCK_SECURITY_FINDINGS;
    }
  },
};

export default securityService;
