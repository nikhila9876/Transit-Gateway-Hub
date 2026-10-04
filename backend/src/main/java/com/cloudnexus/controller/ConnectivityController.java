package com.cloudnexus.controller;

import com.cloudnexus.dto.ApiResponse;
import com.cloudnexus.dto.AuditLogDto;
import com.cloudnexus.dto.ConnectivityTestRequest;
import com.cloudnexus.dto.ConnectivityTestResponse;
import com.cloudnexus.service.AuditService;
import com.cloudnexus.service.ConnectivityService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Optional;

@RestController
@RequestMapping("/api/network")
public class ConnectivityController {

    private final ConnectivityService connectivityService;
    private final Optional<AuditService> auditService;

    public ConnectivityController(ConnectivityService connectivityService,
                                  Optional<AuditService> auditService) {
        this.connectivityService = connectivityService;
        this.auditService = auditService;
    }

    @PostMapping("/test")
    public ResponseEntity<ApiResponse<ConnectivityTestResponse>> testConnectivity(@RequestBody ConnectivityTestRequest request) {
        ConnectivityTestResponse result = connectivityService.testConnectivity(request);

        auditService.ifPresent(service -> {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String username = (auth != null && auth.getName() != null) ? auth.getName() : "network-admin";

            AuditLogDto log = new AuditLogDto();
            log.setUser(username);
            log.setUsername(username);
            log.setAction("Network Test");
            log.setResource((request != null ? request.getSourceVpc() : "VPC-A") + " -> " + (request != null ? request.getDestinationVpc() : "VPC-B"));
            log.setStatus(result != null ? result.getStatus() : "UNKNOWN");
            log.setDetails(result != null ? result.getMessage() : "Connectivity test evaluated.");
            service.recordLog(log);
        });

        return ResponseEntity.ok(ApiResponse.ok("Connectivity test completed", result));
    }
}
