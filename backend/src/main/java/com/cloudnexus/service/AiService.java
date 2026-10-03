package com.cloudnexus.service;

import com.cloudnexus.dto.AiAnalysisRequest;
import com.cloudnexus.dto.AiAnalysisResponse;

/**
 * Service contract for CloudNexus AI Network Intelligence inference.
 * Pluggable for AWS Bedrock / Claude / OpenAI in future phases.
 */
public interface AiService {
    AiAnalysisResponse analyzeNetwork(AiAnalysisRequest request);
}
