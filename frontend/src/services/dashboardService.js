import dashboardApi from '../api/dashboardApi';
import { MOCK_DASHBOARD_SUMMARY } from '../data/mockData';

export const dashboardService = {
  async getSummary() {
    try {
      const summary = await dashboardApi.getSummary();
      if (summary && typeof summary === 'object' && summary.totalVpcs !== undefined) {
        return summary;
      }
      return MOCK_DASHBOARD_SUMMARY;
    } catch (err) {
      console.warn('Backend unavailable, using fallback mock dashboard summary:', err.message);
      return MOCK_DASHBOARD_SUMMARY;
    }
  },
};

export default dashboardService;
