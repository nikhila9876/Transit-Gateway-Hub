import vpcApi from '../api/vpcApi';
import { MOCK_VPCS } from '../data/mockData';

export const vpcService = {
  /**
   * Fetch all VPCs from backend API with fallback
   * @returns {Promise<Array>}
   */
  async getVpcs() {
    try {
      const vpcs = await vpcApi.getAll();
      if (Array.isArray(vpcs) && vpcs.length > 0) {
        return vpcs;
      }
      return MOCK_VPCS;
    } catch (err) {
      console.warn('Backend unavailable, using fallback mock VPCs:', err.message);
      return MOCK_VPCS;
    }
  },

  /**
   * Fetch VPC details by ID from backend API
   * @param {string} id
   * @returns {Promise<Object>}
   */
  async getVpcById(id) {
    try {
      const vpc = await vpcApi.getById(id);
      if (vpc && typeof vpc === 'object' && vpc.id) {
        return vpc;
      }
      const found = MOCK_VPCS.find(
        (v) => v.id === id || v.name?.toLowerCase() === id?.toLowerCase()
      );
      if (found) return found;
      throw new Error(`VPC with id ${id} not found`);
    } catch (err) {
      console.warn('Backend unavailable, searching mock VPCs:', err.message);
      const found = MOCK_VPCS.find(
        (v) => v.id === id || v.name?.toLowerCase() === id?.toLowerCase()
      );
      if (found) return found;
      throw new Error(`VPC with id ${id} not found`);
    }
  },
};

export default vpcService;
