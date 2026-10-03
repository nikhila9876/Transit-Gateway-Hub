import api from './api';
import { MOCK_ROUTE_TABLES } from '../data/mockData';

export const routeTableService = {
  async getRouteTables() {
    try {
      const response = await api.get('/route-tables');
      return response.data;
    } catch (err) {
      console.warn('Backend unavailable, using MockRouteTableService:', err.message);
      return MOCK_ROUTE_TABLES;
    }
  }
};
