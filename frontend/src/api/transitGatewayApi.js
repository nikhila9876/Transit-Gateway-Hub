import apiClient, { extractData, ensureArray } from './client';

export const transitGatewayApi = {
  /**
   * Fetch Central Transit Gateway Details
   * Endpoint: GET /api/transit-gateway
   * @returns {Promise<Object>}
   */
  async getTransitGateway() {
    const response = await apiClient.get('/transit-gateway');
    const data = extractData(response) || {};
    return {
      ...data,
      attachments: ensureArray(data.attachments),
      routes: ensureArray(data.routes),
    };
  },

  /**
   * Fetch all TGW attachments
   * Endpoint: GET /api/transit-gateway/attachments
   * @returns {Promise<Array>}
   */
  async getAttachments() {
    const response = await apiClient.get('/transit-gateway/attachments');
    const data = extractData(response);
    return ensureArray(data);
  },

  /**
   * Fetch all TGW route table entries
   * Endpoint: GET /api/transit-gateway/routes
   * @returns {Promise<Array>}
   */
  async getRoutes() {
    const response = await apiClient.get('/transit-gateway/routes');
    const data = extractData(response);
    return ensureArray(data);
  },
};

export default transitGatewayApi;
