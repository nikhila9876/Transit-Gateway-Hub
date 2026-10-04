package com.cloudnexus.controller;

import com.cloudnexus.dto.ApiResponse;
import com.cloudnexus.dto.MonitoringDto;
import com.cloudnexus.service.MonitoringService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/monitoring")
public class MonitoringController {

    private final MonitoringService monitoringService;

    public MonitoringController(MonitoringService monitoringService) {
        this.monitoringService = monitoringService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<MonitoringDto>> getMonitoringMetrics() {
        return ResponseEntity.ok(ApiResponse.ok("Monitoring metrics fetched successfully", monitoringService.getMonitoringMetrics()));
    }
}
