import api from './api';
import { MOCK_VPCS } from '../data/mockData';

export const vpcService = {
  async getVpcs() {
    try {
      const response = await api.get('/vpcs');
      const payload = response.data;
      // Normalize ApiResponse envelope { success: true, data: [...] } or direct array
      const rawList = payload?.data ?? payload?.vpcs ?? payload;
      if (Array.isArray(rawList)) {
        return rawList;
      }
      return MOCK_VPCS;
    } catch (err) {
      console.warn('Backend unavailable, using MockVpcService:', err.message);
      return MOCK_VPCS;
    }
  },

  async getVpcById(id) {
    try {
      const response = await api.get(`/vpcs/${id}`);
      const payload = response.data;
      const vpc = payload?.data ?? payload;
      if (vpc && typeof vpc === 'object' && vpc.id) {
        return vpc;
      }
      const found = MOCK_VPCS.find(
        (v) => v.id === id || v.name?.toLowerCase() === id?.toLowerCase()
      );
      if (found) return found;
      throw new Error(`VPC with id ${id} not found`);
    } catch (err) {
      console.warn('Backend unavailable, using MockVpcService:', err.message);
      const found = MOCK_VPCS.find(
        (v) => v.id === id || v.name?.toLowerCase() === id?.toLowerCase()
      );
      if (found) return found;
      throw new Error(`VPC with id ${id} not found`);
    }
  },
};

export default vpcService;
