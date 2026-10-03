import api from './api';
import { MOCK_METRICS } from '../data/mockData';

export const monitoringService = {
  async getMetrics() {
    try {
      const response = await api.get('/monitoring');
      return response.data;
    } catch (err) {
      console.warn('Backend unavailable, using MockMonitoringService:', err.message);
      return MOCK_METRICS;
    }
  }
};
