import apiClient, { extractData, ensureArray } from './client';

export const ec2Api = {
  /**
   * Fetch all EC2 workload instances across VPCs
   * Endpoint: GET /api/ec2
   * @returns {Promise<Array>}
   */
  async getAll() {
    const response = await apiClient.get('/ec2');
    const data = extractData(response);
    return ensureArray(data);
  },

  /**
   * Fetch single EC2 instance by ID
   * Endpoint: GET /api/ec2/{id}
   * @param {string} id
   * @returns {Promise<Object>}
   */
  async getById(id) {
    if (!id) throw new Error('EC2 instance ID is required');
    const response = await apiClient.get(`/ec2/${encodeURIComponent(id)}`);
    return extractData(response);
  },
};

export default ec2Api;
