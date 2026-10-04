package com.cloudnexus.controller;

import com.cloudnexus.dto.ApiResponse;
import com.cloudnexus.service.NetworkFlowService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

/**
 * Controller exposing CloudNexus network health scoring and VPC flow log observability.
 */
@RestController
@RequestMapping("/api/network")
public class NetworkHealthController {

    private final NetworkFlowService networkFlowService;

    public NetworkHealthController(NetworkFlowService networkFlowService) {
        this.networkFlowService = networkFlowService;
    }

    @GetMapping("/health")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getNetworkHealth() {
        Map<String, Object> health = networkFlowService.getNetworkHealthSummary();
        return ResponseEntity.ok(ApiResponse.ok("Network health summary retrieved successfully", health));
    }

    @GetMapping("/flow-logs")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getFlowLogs() {
        List<Map<String, Object>> flowLogs = networkFlowService.getFlowLogStatus();
        return ResponseEntity.ok(ApiResponse.ok("Flow logs status retrieved successfully", flowLogs));
    }
}
