import dashboardApi from '../api/dashboardApi';
import { isMockMode } from '../utils/config';
import { mockDashboardService } from './mockServices';

export const dashboardService = {
  async getSummary() {
    if (isMockMode()) {
      return mockDashboardService.getSummary();
    }
    try {
      const summary = await dashboardApi.getSummary();
      if (summary && typeof summary === 'object' && summary.totalVpcs !== undefined) {
        return summary;
      }
      return mockDashboardService.getSummary();
    } catch (err) {
      console.warn('Backend unavailable, using fallback mock dashboard summary:', err.message);
      return mockDashboardService.getSummary();
    }
  },
};

export default dashboardService;
