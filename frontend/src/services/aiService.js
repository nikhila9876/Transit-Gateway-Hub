import aiApi from '../api/aiApi';
import { isMockMode } from '../utils/config';
import { mockAiService } from './mockServices';

export const aiService = {
  /**
   * Submit diagnostic question and context to AI analysis API
   * @param {string} question
   * @param {Object} [context={}]
   * @returns {Promise<Object>}
   */
  async analyzeNetwork(question, context = {}) {
    if (isMockMode()) {
      return mockAiService.analyzeNetwork(question, context);
    }
    try {
      return await aiApi.analyze({ question, prompt: question, context });
    } catch (err) {
      console.warn('Backend unavailable, using fallback mock AI diagnostic:', err.message);
      return mockAiService.analyzeNetwork(question, context);
    }
  },
};

export default aiService;
