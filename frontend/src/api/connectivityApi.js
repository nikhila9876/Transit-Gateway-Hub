import apiClient, { extractData, ensureArray } from './client';

export const connectivityApi = {
  /**
   * Run synthetic cross-VPC network connectivity test
   * Endpoint: POST /api/network/test
   * @param {{ source: string, destination: string, protocol?: string, port?: number }} request
   * @returns {Promise<Object>}
   */
  async testConnectivity(request) {
    const payload = {
      source: request.source || request.sourceVpc,
      sourceVpc: request.source || request.sourceVpc,
      destination: request.destination || request.destinationVpc,
      destinationVpc: request.destination || request.destinationVpc,
      protocol: request.protocol || 'TCP',
      port: Number(request.port) || 8080,
    };
    const response = await apiClient.post('/network/test', payload);
    const data = extractData(response) || {};
    return {
      ...data,
      path: ensureArray(data.path),
      diagnosticMessage: data.diagnosticMessage || data.message || 'Connectivity check completed',
      latency: data.latency ?? data.latencyMs ?? 0,
      latencyMs: data.latencyMs ?? data.latency ?? 0,
    };
  },
};

export default connectivityApi;
