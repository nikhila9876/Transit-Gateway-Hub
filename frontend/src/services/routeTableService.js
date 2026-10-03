import routeTableApi from '../api/routeTableApi';
import { MOCK_ROUTE_TABLES } from '../data/mockData';

export const routeTableService = {
  async getRouteTables() {
    try {
      const list = await routeTableApi.getAll();
      if (Array.isArray(list) && list.length > 0) {
        return list;
      }
      return MOCK_ROUTE_TABLES;
    } catch (err) {
      console.warn('Backend unavailable, using fallback mock route tables:', err.message);
      return MOCK_ROUTE_TABLES;
    }
  },
};

export default routeTableService;
