package com.cloudnexus.service;

import com.cloudnexus.dto.MonitoringDto;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.Map;

/**
 * Mock implementation of {@link MonitoringService}.
 * Emits structured mock metrics with realistic latencies and health percentages.
 */
@Service
public class MockMonitoringService implements MonitoringService {

    @Override
    public MonitoringDto getMonitoringMetrics() {
        List<Map<String, Object>> vpcMetrics = List.of(
                Map.of("vpc", "DEV", "latencyMs", 1.2, "packetLoss", 0.0, "status", "Healthy", "throughputMbps", 124.5),
                Map.of("vpc", "TEST", "latencyMs", 1.4, "packetLoss", 0.0, "status", "Healthy", "throughputMbps", 98.2),
                Map.of("vpc", "PROD", "latencyMs", 1.1, "packetLoss", 0.0, "status", "Healthy", "throughputMbps", 412.8)
        );

        List<Map<String, Object>> tgwMetrics = List.of(
                Map.of("attachment", "Dev-TGW-Attachment", "bytesIn", 104857600L, "bytesOut", 94371840L, "drops", 0),
                Map.of("attachment", "Test-TGW-Attachment", "bytesIn", 83886080L, "bytesOut", 73400320L, "drops", 0),
                Map.of("attachment", "Prod-TGW-Attachment", "bytesIn", 314572800L, "bytesOut", 293601280L, "drops", 0)
        );

        List<Map<String, Object>> recentEvents = List.of(
                Map.of("timestamp", Instant.now().minusSeconds(120).toString(), "level", "INFO", "source", "Enterprise-TGW", "message", "Cross-VPC BGP session synchronized"),
                Map.of("timestamp", Instant.now().minusSeconds(360).toString(), "level", "INFO", "source", "RouteTable", "message", "Route propagation verified for 10.30.0.0/16")
        );

        return new MonitoringDto(
                18.4,
                94.0,
                1.34,
                0.0,
                100,
                "99.99%",
                0,
                "OPTIMAL",
                vpcMetrics,
                tgwMetrics,
                recentEvents,
                Instant.now().toString()
        );
    }
}
