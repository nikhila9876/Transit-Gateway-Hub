import ec2Api from '../api/ec2Api';
import { isMockMode } from '../utils/config';
import { mockEc2Service } from './mockServices';

export const ec2Service = {
  async getInstances() {
    if (isMockMode()) {
      return mockEc2Service.getInstances();
    }
    try {
      const list = await ec2Api.getAll();
      if (Array.isArray(list) && list.length > 0) {
        return list;
      }
      return mockEc2Service.getInstances();
    } catch (err) {
      console.warn('Backend unavailable, using fallback mock EC2 instances:', err.message);
      return mockEc2Service.getInstances();
    }
  },

  async getInstanceById(id) {
    if (isMockMode()) {
      return mockEc2Service.getInstanceById(id);
    }
    try {
      const instance = await ec2Api.getById(id);
      if (instance && instance.id) {
        return instance;
      }
      return mockEc2Service.getInstanceById(id);
    } catch (err) {
      console.warn('Backend unavailable, using fallback mock EC2 instance:', err.message);
      return mockEc2Service.getInstanceById(id);
    }
  },
};

export default ec2Service;
