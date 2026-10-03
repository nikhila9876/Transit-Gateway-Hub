import aiApi from '../api/aiApi';
import { MOCK_AI_RESPONSES } from '../data/mockData';

export const aiService = {
  /**
   * Submit diagnostic question and context to AI analysis API
   * @param {string} question
   * @param {Object} [context={}]
   * @returns {Promise<Object>}
   */
  async analyzeNetwork(question, context = {}) {
    try {
      return await aiApi.analyze({ question, prompt: question, context });
    } catch (err) {
      console.warn('Backend unavailable, using fallback mock AI diagnostic:', err.message);
      const lower = (question || '').toLowerCase();
      const match =
        MOCK_AI_RESPONSES.find((item) => lower.includes(item.prompt.toLowerCase())) ||
        MOCK_AI_RESPONSES[0];
      return {
        query: question,
        summary: match.response || 'Traffic analysis completed across Transit Gateway routes.',
        evidence: 'DEV (10.10.0.0/16) and PROD (10.30.0.0/16) route propagation active on tgw-09e8712a34bc56df0.',
        possibleCause: 'Security Group Prod-App-SG denies direct inbound traffic from DEV VPC CIDR.',
        recommendedChecks: [
          'Verify Transit Gateway route table propagation',
          'Inspect Prod-App-SG ingress security group rules',
          'Check Systems Manager reachability on workload instances'
        ],
        recommendedAction: 'Route cross-VPC calls through TEST VPC intermediary or update security group whitelist if approved.',
        analysis: match.response,
        model: 'CloudNexus-Network-Architect-v1 (MOCK-SIMULATION)',
        confidence: 0.96,
        timestamp: new Date().toISOString(),
      };
    }
  },
};

export default aiService;
