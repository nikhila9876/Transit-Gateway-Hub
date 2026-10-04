import transitGatewayApi from '../api/transitGatewayApi';
import { isMockMode } from '../utils/config';
import { mockTransitGatewayService } from './mockServices';

export const transitGatewayService = {
  async getTransitGateway() {
    if (isMockMode()) {
      return mockTransitGatewayService.getTransitGateway();
    }
    try {
      const tgw = await transitGatewayApi.getTransitGateway();
      if (tgw && typeof tgw === 'object' && tgw.id) {
        return tgw;
      }
      return mockTransitGatewayService.getTransitGateway();
    } catch (err) {
      console.warn('Backend unavailable, using fallback mock Transit Gateway:', err.message);
      return mockTransitGatewayService.getTransitGateway();
    }
  },

  async getAttachments() {
    if (isMockMode()) {
      return mockTransitGatewayService.getAttachments();
    }
    try {
      const attachments = await transitGatewayApi.getAttachments();
      if (Array.isArray(attachments) && attachments.length > 0) {
        return attachments;
      }
      return mockTransitGatewayService.getAttachments();
    } catch (err) {
      console.warn('Backend unavailable, using fallback mock TGW attachments:', err.message);
      return mockTransitGatewayService.getAttachments();
    }
  },

  async getRoutes() {
    if (isMockMode()) {
      return mockTransitGatewayService.getRoutes();
    }
    try {
      const routes = await transitGatewayApi.getRoutes();
      if (Array.isArray(routes) && routes.length > 0) {
        return routes;
      }
      return mockTransitGatewayService.getRoutes();
    } catch (err) {
      console.warn('Backend unavailable, using fallback mock TGW routes:', err.message);
      return mockTransitGatewayService.getRoutes();
    }
  },
};

export default transitGatewayService;
