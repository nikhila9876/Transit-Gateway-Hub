import api from './api';
import { MOCK_DASHBOARD_SUMMARY } from '../data/mockData';

export const dashboardService = {
  async getSummary() {
    try {
      const response = await api.get('/dashboard/summary');
      return response.data;
    } catch (err) {
      console.warn('Backend unavailable, using MockDashboardService:', err.message);
      return MOCK_DASHBOARD_SUMMARY;
    }
  }
};
