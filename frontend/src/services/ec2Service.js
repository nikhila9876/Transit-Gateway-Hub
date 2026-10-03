import ec2Api from '../api/ec2Api';
import { MOCK_EC2_INSTANCES } from '../data/mockData';

export const ec2Service = {
  async getInstances() {
    try {
      const list = await ec2Api.getAll();
      if (Array.isArray(list) && list.length > 0) {
        return list;
      }
      return MOCK_EC2_INSTANCES;
    } catch (err) {
      console.warn('Backend unavailable, using fallback mock EC2 instances:', err.message);
      return MOCK_EC2_INSTANCES;
    }
  },

  async getInstanceById(id) {
    try {
      const instance = await ec2Api.getById(id);
      if (instance && instance.id) {
        return instance;
      }
      return MOCK_EC2_INSTANCES.find((i) => i.id === id) || null;
    } catch (err) {
      console.warn('Backend unavailable, using fallback mock EC2 instance:', err.message);
      return MOCK_EC2_INSTANCES.find((i) => i.id === id) || null;
    }
  },
};

export default ec2Service;
