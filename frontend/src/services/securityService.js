import securityApi from '../api/securityApi';
import { MOCK_SECURITY_FINDINGS } from '../data/mockData';

export const securityService = {
  async getFindings() {
    try {
      const list = await securityApi.getFindings();
      if (Array.isArray(list) && list.length > 0) {
        return list;
      }
      return MOCK_SECURITY_FINDINGS;
    } catch (err) {
      console.warn('Backend unavailable, using fallback mock security findings:', err.message);
      return MOCK_SECURITY_FINDINGS;
    }
  },
};

export default securityService;
