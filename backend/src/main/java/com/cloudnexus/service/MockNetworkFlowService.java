package com.cloudnexus.service;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.Map;

/**
 * Mock implementation of {@link NetworkFlowService}.
 */
@Service
@ConditionalOnProperty(name = "cloudnexus.data-source", havingValue = "mock")
public class MockNetworkFlowService implements NetworkFlowService {

    @Override
    public List<Map<String, Object>> getFlowLogStatus() {
        return List.of(
                Map.of(
                        "flowLogId", "fl-dev01a2b3c4d",
                        "vpcId", "vpc-0dev1234567890",
                        "vpcName", "Dev-VPC",
                        "trafficType", "ALL",
                        "status", "ACTIVE",
                        "logDestinationType", "cloud-watch-logs",
                        "logDestination", "arn:aws:logs:us-east-1:123456789012:log-group:flow-logs-dev"
                ),
                Map.of(
                        "flowLogId", "fl-test02b3c4d5e",
                        "vpcId", "vpc-0test2345678901",
                        "vpcName", "Test-VPC",
                        "trafficType", "ALL",
                        "status", "ACTIVE",
                        "logDestinationType", "cloud-watch-logs",
                        "logDestination", "arn:aws:logs:us-east-1:123456789012:log-group:flow-logs-test"
                ),
                Map.of(
                        "flowLogId", "fl-prod03c4d5e6f",
                        "vpcId", "vpc-0prod3456789012",
                        "vpcName", "Prod-VPC",
                        "trafficType", "ALL",
                        "status", "ACTIVE",
                        "logDestinationType", "cloud-watch-logs",
                        "logDestination", "arn:aws:logs:us-east-1:123456789012:log-group:flow-logs-prod"
                )
        );
    }

    @Override
    public Map<String, Object> getNetworkHealthSummary() {
        return Map.of(
                "overallScore", 92,
                "status", "Excellent",
                "networkScore", 95,
                "computeScore", 90,
                "securityScore", 88,
                "connectivityScore", 94,
                "monitoringScore", 93,
                "timestamp", Instant.now().toString(),
                "reasons", List.of(
                        "Transit Gateway Enterprise-TGW operational with 3 active attachments",
                        "VPC Route tables fully synchronized across DEV, TEST, and PROD",
                        "All monitored EC2 compute instances responding normally"
                )
        );
    }
}
