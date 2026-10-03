package com.cloudnexus.service;

import com.cloudnexus.dto.ConnectivityTestRequest;
import com.cloudnexus.dto.ConnectivityTestResponse;

/**
 * Service contract for synthetic VPC-to-VPC connectivity testing and path tracing.
 */
public interface ConnectivityService {
    ConnectivityTestResponse testConnectivity(ConnectivityTestRequest request);
}
