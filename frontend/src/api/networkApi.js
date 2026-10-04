import apiClient, { extractData, ensureArray } from './client';

export const networkApi = {
  /**
   * Fetch CloudNexus Network Health Summary
   * Endpoint: GET /api/network/health
   * @returns {Promise<Object>}
   */
  async getNetworkHealth() {
    const response = await apiClient.get('/network/health');
    return extractData(response) || {};
  },

  /**
   * Fetch VPC Flow Logs Status
   * Endpoint: GET /api/network/flow-logs
   * @returns {Promise<Array>}
   */
  async getFlowLogs() {
    const response = await apiClient.get('/network/flow-logs');
    return ensureArray(extractData(response));
  },
};

export default networkApi;
