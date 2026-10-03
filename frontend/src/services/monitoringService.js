import api from './api';
import { MOCK_METRICS } from '../data/mockData';

export const monitoringService = {
  async getMetrics() {
    try {
      const response = await api.get('/monitoring');
      const payload = response.data;
      const metrics = payload?.data ?? payload;
      if (metrics && typeof metrics === 'object') {
        return metrics;
      }
      return MOCK_METRICS;
    } catch (err) {
      console.warn('Backend unavailable, using MockMonitoringService:', err.message);
      return MOCK_METRICS;
    }
  },
};

export default monitoringService;
