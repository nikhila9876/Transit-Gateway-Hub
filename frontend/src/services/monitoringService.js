import monitoringApi from '../api/monitoringApi';
import { MOCK_METRICS } from '../data/mockData';

export const monitoringService = {
  async getMetrics() {
    try {
      const metrics = await monitoringApi.getMetrics();
      if (metrics && typeof metrics === 'object') {
        return metrics;
      }
      return MOCK_METRICS;
    } catch (err) {
      console.warn('Backend unavailable, using fallback mock monitoring telemetry:', err.message);
      return MOCK_METRICS;
    }
  },
};

export default monitoringService;
