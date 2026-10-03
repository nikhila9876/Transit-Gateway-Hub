import { auditApi } from '../api/auditApi';
import { MOCK_AUDIT_LOGS } from '../data/mockData';

export const auditService = {
  /**
   * Fetch compliance audit logs from backend API GET /api/audit
   * @returns {Promise<Array>}
   */
  async getAuditLogs() {
    try {
      const logs = await auditApi.getLogs();
      if (Array.isArray(logs) && logs.length > 0) {
        return logs;
      }
      return MOCK_AUDIT_LOGS;
    } catch (err) {
      console.warn('Backend unavailable, using fallback mock audit logs:', err.message);
      return MOCK_AUDIT_LOGS;
    }
  },
};

export default auditService;

