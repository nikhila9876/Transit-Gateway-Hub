import transitGatewayApi from '../api/transitGatewayApi';
import { MOCK_TRANSIT_GATEWAY } from '../data/mockData';

export const transitGatewayService = {
  async getTransitGateway() {
    try {
      const tgw = await transitGatewayApi.getTransitGateway();
      if (tgw && typeof tgw === 'object' && tgw.id) {
        return tgw;
      }
      return MOCK_TRANSIT_GATEWAY;
    } catch (err) {
      console.warn('Backend unavailable, using fallback mock Transit Gateway:', err.message);
      return MOCK_TRANSIT_GATEWAY;
    }
  },

  async getAttachments() {
    try {
      const attachments = await transitGatewayApi.getAttachments();
      if (Array.isArray(attachments) && attachments.length > 0) {
        return attachments;
      }
      return MOCK_TRANSIT_GATEWAY.attachments || [];
    } catch (err) {
      console.warn('Backend unavailable, using fallback mock TGW attachments:', err.message);
      return MOCK_TRANSIT_GATEWAY.attachments || [];
    }
  },

  async getRoutes() {
    try {
      const routes = await transitGatewayApi.getRoutes();
      if (Array.isArray(routes) && routes.length > 0) {
        return routes;
      }
      return MOCK_TRANSIT_GATEWAY.routes || [];
    } catch (err) {
      console.warn('Backend unavailable, using fallback mock TGW routes:', err.message);
      return MOCK_TRANSIT_GATEWAY.routes || [];
    }
  },
};

export default transitGatewayService;
