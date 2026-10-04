import apiClient, { extractData, ensureArray } from './client';

export const dashboardApi = {
  /**
   * Fetch Dashboard Summary metrics
   * Endpoint: GET /api/dashboard/summary
   * @returns {Promise<Object>}
   */
  async getSummary() {
    const response = await apiClient.get('/dashboard/summary');
    const data = extractData(response) || {};
    return {
      ...data,
      totalVpcs: data.totalVpcs ?? data.vpcCount ?? 0,
      vpcCount: data.vpcCount ?? data.totalVpcs ?? 0,
      tgwAttachments: data.tgwAttachments ?? data.attachmentCount ?? 0,
      attachmentCount: data.attachmentCount ?? data.tgwAttachments ?? 0,
      ec2Instances: data.ec2Instances ?? data.ec2Count ?? 0,
      ec2Count: data.ec2Count ?? data.ec2Instances ?? 0,
      networkHealth: data.networkHealth ?? 100,
      securityFindings: data.securityFindings ?? 0,
      transitGatewayStatus: data.transitGatewayStatus || 'Available',
      transitGatewayName: data.transitGatewayName || 'Enterprise-TGW',
      recentActivity: ensureArray(data.recentActivity),
      environmentBreakdown: ensureArray(data.environmentBreakdown),
    };
  },
};

export default dashboardApi;
