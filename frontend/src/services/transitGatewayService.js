import api from './api';
import { MOCK_TRANSIT_GATEWAY } from '../data/mockData';

export const transitGatewayService = {
  async getTransitGateway() {
    try {
      const response = await api.get('/transit-gateway');
      return response.data;
    } catch (err) {
      console.warn('Backend unavailable, using MockTransitGatewayService:', err.message);
      return MOCK_TRANSIT_GATEWAY;
    }
  },

  async getAttachments() {
    try {
      const response = await api.get('/transit-gateway/attachments');
      return response.data;
    } catch (err) {
      console.warn('Backend unavailable, using MockTransitGatewayService:', err.message);
      return MOCK_TRANSIT_GATEWAY.attachments;
    }
  },

  async getRoutes() {
    try {
      const response = await api.get('/transit-gateway/routes');
      return response.data;
    } catch (err) {
      console.warn('Backend unavailable, using MockTransitGatewayService:', err.message);
      return MOCK_TRANSIT_GATEWAY.routes;
    }
  }
};
