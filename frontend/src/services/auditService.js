import api from './api';
import { MOCK_AUDIT_LOGS } from '../data/mockData';

export const auditService = {
  async getAuditLogs() {
    try {
      const response = await api.get('/audit');
      return response.data;
    } catch (err) {
      console.warn('Backend unavailable, using MockAuditService:', err.message);
      return MOCK_AUDIT_LOGS;
    }
  }
};
