package com.cloudnexus.service;

import java.util.List;
import java.util.Map;

/**
 * Service contract for VPC Flow Log telemetry inspection and composite network health analysis.
 */
public interface NetworkFlowService {
    List<Map<String, Object>> getFlowLogStatus();
    Map<String, Object> getNetworkHealthSummary();
}
