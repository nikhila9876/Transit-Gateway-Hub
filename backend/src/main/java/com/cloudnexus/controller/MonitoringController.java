package com.cloudnexus.controller;

import com.cloudnexus.dto.ApiResponse;
import com.cloudnexus.dto.MonitoringResponse;
import com.cloudnexus.service.MonitoringService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * REST controller exposing the {@code GET /api/monitoring} endpoint.
 *
 * <p>Returns aggregated network-health and performance metrics for all VPCs
 * and the Enterprise Transit Gateway. In Phase 1 the data is mock-simulated;
 * Phase 2 will wire in live AWS CloudWatch metrics via the monitoring service.</p>
 */
@RestController
@RequestMapping("/api/monitoring")
public class MonitoringController {

    private final MonitoringService monitoringService;

    public MonitoringController(MonitoringService monitoringService) {
        this.monitoringService = monitoringService;
    }

    /**
     * Returns real-time (mock) monitoring metrics for the CloudNexus network.
     *
     * @return {@link MonitoringResponse} wrapped in a standard {@link ApiResponse}
     */
    @GetMapping
    public ResponseEntity<ApiResponse<MonitoringResponse>> getMonitoringMetrics() {
        return ResponseEntity.ok(ApiResponse.ok(monitoringService.getMonitoringMetrics()));
    }
}
