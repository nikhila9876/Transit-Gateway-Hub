import apiClient, { extractData, ensureArray } from './client';

export const routeTableApi = {
  /**
   * Fetch all VPC Route Tables
   * Endpoint: GET /api/route-tables
   * @returns {Promise<Array>}
   */
  async getAll() {
    const response = await apiClient.get('/route-tables');
    const data = extractData(response);
    const list = ensureArray(data);
    return list.map((rt) => ({
      ...rt,
      routes: ensureArray(rt.routes),
      associatedSubnets: ensureArray(rt.associatedSubnets),
    }));
  },
};

export default routeTableApi;
