import api from './api';
import { MOCK_VPCS } from '../data/mockData';

export const vpcService = {
  async getVpcs() {
    try {
      const response = await api.get('/vpcs');
      return response.data;
    } catch (err) {
      console.warn('Backend unavailable, using MockVpcService:', err.message);
      return MOCK_VPCS;
    }
  },

  async getVpcById(id) {
    try {
      const response = await api.get(`/vpcs/${id}`);
      return response.data;
    } catch (err) {
      console.warn('Backend unavailable, using MockVpcService:', err.message);
      const found = MOCK_VPCS.find(v => v.id === id || v.name.toLowerCase() === id.toLowerCase());
      if (found) return found;
      throw new Error(`VPC with id ${id} not found`);
    }
  }
};
