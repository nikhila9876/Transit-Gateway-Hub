import routeTableApi from '../api/routeTableApi';
import { isMockMode } from '../utils/config';
import { mockRouteTableService } from './mockServices';

export const routeTableService = {
  async getRouteTables() {
    if (isMockMode()) {
      return mockRouteTableService.getRouteTables();
    }
    try {
      const list = await routeTableApi.getAll();
      if (Array.isArray(list) && list.length > 0) {
        return list;
      }
      return mockRouteTableService.getRouteTables();
    } catch (err) {
      console.warn('Backend unavailable, using fallback mock route tables:', err.message);
      return mockRouteTableService.getRouteTables();
    }
  },
};

export default routeTableService;
