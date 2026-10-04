package com.cloudnexus.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import software.amazon.awssdk.services.sts.StsClient;

import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Optional;

/**
 * Health check endpoint providing observability into application status and AWS connectivity.
 * Safe for unauthenticated probes (load balancers, status badges, liveness checks).
 */
@RestController
@RequestMapping("/api/health")
public class HealthController {

    private static final Logger log = LoggerFactory.getLogger(HealthController.class);

    private final Optional<StsClient> stsClient;
    private final String dataSource;

    public HealthController(Optional<StsClient> stsClient,
                            @Value("${cloudnexus.data-source:aws}") String dataSource) {
        this.stsClient = stsClient;
        this.dataSource = dataSource;
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> getHealth() {
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("application", "UP");

        String awsStatus = "UNAVAILABLE";
        if ("mock".equalsIgnoreCase(dataSource)) {
            awsStatus = "AVAILABLE";
        } else if (stsClient.isPresent()) {
            try {
                stsClient.get().getCallerIdentity();
                awsStatus = "AVAILABLE";
            } catch (Exception e) {
                log.info("AWS STS probe check: {}", e.getMessage());
                awsStatus = "UNAVAILABLE";
            }
        }

        response.put("aws", awsStatus);
        response.put("timestamp", Instant.now().toString());

        return ResponseEntity.ok(response);
    }
}
