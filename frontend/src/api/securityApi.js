import apiClient, { extractData, ensureArray } from './client';

export const securityApi = {
  /**
   * Fetch all Security Center findings
   * Endpoint: GET /api/security
   * @returns {Promise<Array>}
   */
  async getFindings() {
    const response = await apiClient.get('/security');
    const data = extractData(response);
    return ensureArray(data);
  },
};

export default securityApi;
