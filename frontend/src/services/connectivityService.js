import connectivityApi from '../api/connectivityApi';
import { isMockMode } from '../utils/config';
import { mockConnectivityService } from './mockServices';

export const connectivityService = {
  /**
   * Test network reachability between VPCs
   * @param {string} source
   * @param {string} destination
   * @param {string} protocol
   * @param {number} port
   * @returns {Promise<Object>}
   */
  async testConnectivity(source, destination, protocol = 'TCP', port = 8080) {
    if (isMockMode()) {
      return mockConnectivityService.testConnectivity(source, destination, protocol, port);
    }
    try {
      return await connectivityApi.testConnectivity({
        source,
        sourceVpc: source,
        destination,
        destinationVpc: destination,
        protocol,
        port,
      });
    } catch (err) {
      console.warn('Backend probe returned error or unreachable, using fallback simulation:', err.message);
      return mockConnectivityService.testConnectivity(source, destination, protocol, port);
    }
  },
};

export default connectivityService;
