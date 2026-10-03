import api from './api';
import { MOCK_EC2_INSTANCES } from '../data/mockData';

export const ec2Service = {
  async getInstances() {
    try {
      const response = await api.get('/ec2');
      const payload = response.data;
      const list = payload?.data ?? payload?.instances ?? payload;
      if (Array.isArray(list)) {
        return list;
      }
      return MOCK_EC2_INSTANCES;
    } catch (err) {
      console.warn('Backend unavailable, using MockEc2Service:', err.message);
      return MOCK_EC2_INSTANCES;
    }
  },
};

export default ec2Service;
