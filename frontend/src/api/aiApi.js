import apiClient, { extractData, ensureArray } from './client';

export const aiApi = {
  /**
   * Submit natural language query or troubleshooting prompt for AI network analysis
   * Endpoint: POST /api/ai/analyze
   * @param {{ question: string, prompt?: string, context?: Object }} request
   * @returns {Promise<Object>}
   */
  async analyze(request) {
    const payload = {
      question: request.question || request.prompt || '',
      prompt: request.prompt || request.question || '',
      context: request.context || {},
    };
    const response = await apiClient.post('/ai/analyze', payload);
    const data = extractData(response) || {};
    return {
      ...data,
      summary: data.summary || '',
      evidence: data.evidence || '',
      possibleCause: data.possibleCause || '',
      recommendedChecks: ensureArray(data.recommendedChecks),
      recommendedAction: data.recommendedAction || '',
      analysis: data.analysis || '',
      model: data.model || 'Mock-Claude-AWS-Architect',
      confidence: data.confidence ?? 0.95,
      timestamp: data.timestamp || new Date().toISOString(),
    };
  },
};

export default aiApi;
