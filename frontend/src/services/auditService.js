import api from './api';
import { MOCK_AUDIT_LOGS } from '../data/mockData';

export const auditService = {
  async getAuditLogs() {
    try {
      const response = await api.get('/audit');
      const payload = response.data;
      const list = payload?.data ?? payload?.logs ?? payload;
      if (Array.isArray(list)) {
        return list;
      }
      return MOCK_AUDIT_LOGS;
    } catch (err) {
      console.warn('Backend unavailable, using MockAuditService:', err.message);
      return MOCK_AUDIT_LOGS;
    }
  },
};

export default auditService;
