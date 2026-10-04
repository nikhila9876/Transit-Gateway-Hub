package com.cloudnexus.ai;

import com.cloudnexus.dto.AiAnalysisRequest;
import com.cloudnexus.dto.AiAnalysisResponse;

/**
 * Domain interface for CloudNexus AI Network Intelligence inference engines.
 * Pluggable for AWS Bedrock, Amazon Titan, Claude, or mock development engines.
 */
public interface AiInferenceProvider {
    AiAnalysisResponse generateInsight(AiAnalysisRequest request);
}
