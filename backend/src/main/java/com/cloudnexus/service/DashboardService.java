package com.cloudnexus.service;

import com.cloudnexus.dto.DashboardSummaryDto;

/**
 * Service contract for platform dashboard intelligence and summary metrics.
 */
public interface DashboardService {
    DashboardSummaryDto getSummary();
}
