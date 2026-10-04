import monitoringApi from '../api/monitoringApi';
import { isMockMode } from '../utils/config';
import { mockMonitoringService } from './mockServices';

export const monitoringService = {
  async getMetrics() {
    if (isMockMode()) {
      return mockMonitoringService.getMetrics();
    }
    try {
      const metrics = await monitoringApi.getMetrics();
      if (metrics && typeof metrics === 'object') {
        return metrics;
      }
      return mockMonitoringService.getMetrics();
    } catch (err) {
      console.warn('Backend unavailable, using fallback mock monitoring telemetry:', err.message);
      return mockMonitoringService.getMetrics();
    }
  },
};

export default monitoringService;
