import vpcApi from '../api/vpcApi';
import { isMockMode } from '../utils/config';
import { mockVpcService } from './mockServices';

export const vpcService = {
  /**
   * Fetch all VPCs from backend API or mock service
   * @returns {Promise<Array>}
   */
  async getVpcs() {
    if (isMockMode()) {
      return mockVpcService.getVpcs();
    }
    try {
      const vpcs = await vpcApi.getAll();
      if (Array.isArray(vpcs) && vpcs.length > 0) {
        return vpcs;
      }
      return mockVpcService.getVpcs();
    } catch (err) {
      console.warn('Backend unavailable, using fallback mock VPCs:', err.message);
      return mockVpcService.getVpcs();
    }
  },

  /**
   * Fetch VPC details by ID from backend API or mock service
   * @param {string} id
   * @returns {Promise<Object>}
   */
  async getVpcById(id) {
    if (isMockMode()) {
      return mockVpcService.getVpcById(id);
    }
    try {
      const vpc = await vpcApi.getById(id);
      if (vpc && typeof vpc === 'object' && vpc.id) {
        return vpc;
      }
      return mockVpcService.getVpcById(id);
    } catch (err) {
      console.warn('Backend unavailable, searching mock VPCs:', err.message);
      return mockVpcService.getVpcById(id);
    }
  },
};

export default vpcService;
