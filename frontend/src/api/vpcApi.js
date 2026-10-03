import apiClient, { extractData, ensureArray } from './client';

export const vpcApi = {
  /**
   * Fetch all VPCs
   * Endpoint: GET /api/vpcs
   * @returns {Promise<Array>}
   */
  async getAll() {
    const response = await apiClient.get('/vpcs');
    const data = extractData(response);
    return ensureArray(data);
  },

  /**
   * Fetch single VPC details by ID or Name
   * Endpoint: GET /api/vpcs/{id}
   * @param {string} id
   * @returns {Promise<Object>}
   */
  async getById(id) {
    if (!id) throw new Error('VPC ID is required');
    const response = await apiClient.get(`/vpcs/${encodeURIComponent(id)}`);
    const data = extractData(response);
    if (!data) throw new Error(`VPC not found for identifier: ${id}`);
    return {
      ...data,
      subnets: ensureArray(data.subnets),
    };
  },
};

export default vpcApi;
