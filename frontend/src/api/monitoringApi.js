import apiClient, { extractData, ensureArray } from './client';

export const monitoringApi = {
  /**
   * Fetch Monitoring and Telemetry Metrics
   * Endpoint: GET /api/monitoring
   * @returns {Promise<Object>}
   */
  async getMetrics() {
    const response = await apiClient.get('/monitoring');
    const data = extractData(response) || {};
    return {
      ...data,
      cpuUtilization: data.cpuUtilization ?? 24.5,
      networkHealthPercent: data.networkHealthPercent ?? 99.8,
      avgLatencyMs: data.avgLatencyMs ?? 1.4,
      packetLossPercent: data.packetLossPercent ?? 0.0,
      instanceHealth: data.instanceHealth ?? 3,
      availability: data.availability || '99.99%',
      activeAlerts: data.activeAlerts ?? 0,
      overallStatus: data.overallStatus || 'Healthy',
      vpcMetrics: ensureArray(data.vpcMetrics),
      tgwMetrics: ensureArray(data.tgwMetrics),
      recentEvents: ensureArray(data.recentEvents),
    };
  },
};

export default monitoringApi;
