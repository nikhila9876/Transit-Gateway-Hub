import { auditApi } from '../api/auditApi';
import { isMockMode } from '../utils/config';
import { mockAuditService } from './mockServices';

export const auditService = {
  /**
   * Fetch compliance audit logs from backend API GET /api/audit or mock service
   * @returns {Promise<Array>}
   */
  async getAuditLogs() {
    if (isMockMode()) {
      return mockAuditService.getAuditLogs();
    }
    try {
      const logs = await auditApi.getLogs();
      if (Array.isArray(logs) && logs.length > 0) {
        return logs;
      }
      return mockAuditService.getAuditLogs();
    } catch (err) {
      console.warn('Backend unavailable, using fallback mock audit logs:', err.message);
      return mockAuditService.getAuditLogs();
    }
  },
};

export default auditService;
