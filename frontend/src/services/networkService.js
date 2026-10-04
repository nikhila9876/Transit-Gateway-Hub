import networkApi from '../api/networkApi';
import { isMockMode } from '../utils/config';
import { mockNetworkService } from './mockServices';

export const networkService = {
  async getNetworkHealth() {
    if (isMockMode()) {
      return mockNetworkService.getNetworkHealth();
    }
    try {
      const data = await networkApi.getNetworkHealth();
      if (data && typeof data === 'object' && data.overallScore !== undefined) {
        return data;
      }
      return mockNetworkService.getNetworkHealth();
    } catch (err) {
      console.warn('Network health API unavailable, using fallback model:', err.message);
      return mockNetworkService.getNetworkHealth();
    }
  },

  async getFlowLogs() {
    if (isMockMode()) {
      return mockNetworkService.getFlowLogs();
    }
    try {
      const data = await networkApi.getFlowLogs();
      if (Array.isArray(data) && data.length > 0) {
        return data;
      }
      return mockNetworkService.getFlowLogs();
    } catch (err) {
      console.warn('Flow logs API unavailable, using fallback mock flow logs:', err.message);
      return mockNetworkService.getFlowLogs();
    }
  },
};

export default networkService;
