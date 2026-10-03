package com.cloudnexus.service;

import com.cloudnexus.dto.MonitoringDto;

/**
 * Service contract for network observability and telemetry metrics.
 * Designed for seamless transition to live AWS CloudWatch metrics in Phase 2.
 */
public interface MonitoringService {
    MonitoringDto getMonitoringMetrics();
}
