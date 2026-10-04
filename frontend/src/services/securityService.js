import securityApi from '../api/securityApi';
import { isMockMode } from '../utils/config';
import { mockSecurityService } from './mockServices';

export const securityService = {
  async getFindings() {
    if (isMockMode()) {
      return mockSecurityService.getFindings();
    }
    try {
      const list = await securityApi.getFindings();
      if (Array.isArray(list) && list.length > 0) {
        return list;
      }
      return mockSecurityService.getFindings();
    } catch (err) {
      console.warn('Backend unavailable, using fallback mock security findings:', err.message);
      return mockSecurityService.getFindings();
    }
  },
};

export default securityService;
