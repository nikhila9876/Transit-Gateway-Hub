import api from './api';
import { MOCK_DASHBOARD_SUMMARY } from '../data/mockData';

export const dashboardService = {
  async getSummary() {
    try {
      const response = await api.get('/dashboard/summary');
      const payload = response.data;
      const summary = payload?.data ?? payload;
      if (summary && typeof summary === 'object' && summary.totalVpcs !== undefined) {
        return summary;
      }
      return MOCK_DASHBOARD_SUMMARY;
    } catch (err) {
      console.warn('Backend unavailable, using MockDashboardService:', err.message);
      return MOCK_DASHBOARD_SUMMARY;
    }
  },
};

export default dashboardService;
