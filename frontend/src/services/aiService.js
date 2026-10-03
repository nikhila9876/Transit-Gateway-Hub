import api from './api';
import { MOCK_AI_RESPONSES } from '../data/mockData';

export const aiService = {
  async analyzeNetwork(prompt) {
    try {
      const response = await api.post('/ai/analyze', { prompt });
      const payload = response.data;
      return payload?.data ?? payload;
    } catch (err) {
      console.warn('Backend unavailable, using MockAiService:', err.message);
      const lower = (prompt || '').toLowerCase();
      const match =
        MOCK_AI_RESPONSES.find((item) => lower.includes(item.prompt.toLowerCase())) ||
        MOCK_AI_RESPONSES[0];
      return {
        query: prompt,
        analysis: match.response,
        model: 'CloudNexus-Network-Intelligence-Engine-v1',
        confidence: 0.98,
        timestamp: new Date().toISOString(),
      };
    }
  },
};

export default aiService;
