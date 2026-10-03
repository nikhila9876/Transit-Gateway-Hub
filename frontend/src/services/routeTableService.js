import api from './api';
import { MOCK_ROUTE_TABLES } from '../data/mockData';

export const routeTableService = {
  async getRouteTables() {
    try {
      const response = await api.get('/route-tables');
      const payload = response.data;
      const list = payload?.data ?? payload?.routeTables ?? payload;
      if (Array.isArray(list)) {
        return list;
      }
      return MOCK_ROUTE_TABLES;
    } catch (err) {
      console.warn('Backend unavailable, using MockRouteTableService:', err.message);
      return MOCK_ROUTE_TABLES;
    }
  },
};

export default routeTableService;
