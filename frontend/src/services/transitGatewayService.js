import api from './api';
import { MOCK_TRANSIT_GATEWAY } from '../data/mockData';

export const transitGatewayService = {
  async getTransitGateway() {
    try {
      const response = await api.get('/transit-gateway');
      const payload = response.data;
      const tgw = payload?.data ?? payload;
      if (tgw && typeof tgw === 'object' && tgw.id) {
        return tgw;
      }
      return MOCK_TRANSIT_GATEWAY;
    } catch (err) {
      console.warn('Backend unavailable, using MockTransitGatewayService:', err.message);
      return MOCK_TRANSIT_GATEWAY;
    }
  },

  async getAttachments() {
    try {
      const response = await api.get('/transit-gateway/attachments');
      const payload = response.data;
      const list = payload?.data ?? payload?.attachments ?? payload;
      if (Array.isArray(list)) {
        return list;
      }
      return MOCK_TRANSIT_GATEWAY.attachments || [];
    } catch (err) {
      console.warn('Backend unavailable, using MockTransitGatewayService:', err.message);
      return MOCK_TRANSIT_GATEWAY.attachments || [];
    }
  },

  async getRoutes() {
    try {
      const response = await api.get('/transit-gateway/routes');
      const payload = response.data;
      const list = payload?.data ?? payload?.routes ?? payload;
      if (Array.isArray(list)) {
        return list;
      }
      return MOCK_TRANSIT_GATEWAY.routes || [];
    } catch (err) {
      console.warn('Backend unavailable, using MockTransitGatewayService:', err.message);
      return MOCK_TRANSIT_GATEWAY.routes || [];
    }
  },
};

export default transitGatewayService;
