import apiClient, { extractData, ensureArray } from './client';

export const auditApi = {
  /**
   * Fetch all system audit logs
   * Endpoint: GET /api/audit
   * @returns {Promise<Array>}
   */
  async getLogs() {
    const response = await apiClient.get('/audit');
    const data = extractData(response);
    return ensureArray(data);
  },
};

export default auditApi;
