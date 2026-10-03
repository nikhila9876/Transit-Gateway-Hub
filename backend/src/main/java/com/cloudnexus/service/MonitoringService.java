package com.cloudnexus.service;

import com.cloudnexus.dto.MonitoringResponse;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

/**
 * MonitoringService – Phase 1 mock implementation.
 *
 * <p>Returns simulated network health metrics for DEV, TEST, and PROD VPCs
 * connected via Enterprise-TGW. In Phase 2, this service will be replaced
 * by an AwsMonitoringService backed by AWS CloudWatch SDK calls.</p>
 */
@Service
public class MonitoringService {

    /**
     * Returns aggregated network monitoring metrics.
     * All values are deterministic mock data representing a healthy multi-VPC environment.
     */
    public MonitoringResponse getMonitoringMetrics() {

        List<Map<String, Object>> vpcMetrics = List.of(
                Map.of(
                        "vpcName", "DEV",
                        "vpcId", "vpc-0dev1010001",
                        "cidr", "10.10.0.0/16",
                        "latencyMs", 1.2,
                        "packetLoss", 0.0,
                        "status", "Healthy",
                        "inboundTrafficKbps", 1820,
                        "outboundTrafficKbps", 940,
                        "flowLogsEnabled", false
                ),
                Map.of(
                        "vpcName", "TEST",
                        "vpcId", "vpc-0test1020002",
                        "cidr", "10.20.0.0/16",
                        "latencyMs", 1.3,
                        "packetLoss", 0.0,
                        "status", "Healthy",
                        "inboundTrafficKbps", 2100,
                        "outboundTrafficKbps", 1150,
                        "flowLogsEnabled", false
                ),
                Map.of(
                        "vpcName", "PROD",
                        "vpcId", "vpc-0prod1030003",
                        "cidr", "10.30.0.0/16",
                        "latencyMs", 1.4,
                        "packetLoss", 0.0,
                        "status", "Healthy",
                        "inboundTrafficKbps", 3400,
                        "outboundTrafficKbps", 2200,
                        "flowLogsEnabled", false
                )
        );

        // Map.of() supports max 10 key-value pairs; build TGW metrics with HashMap
        Map<String, Object> tgwEntry = new HashMap<>();
        tgwEntry.put("tgwId", "tgw-09e8712a34bc56df0");
        tgwEntry.put("tgwName", "Enterprise-TGW");
        tgwEntry.put("region", "us-east-1");
        tgwEntry.put("attachments", 3);
        tgwEntry.put("activeRoutes", 3);
        tgwEntry.put("blackholeRoutes", 0);
        tgwEntry.put("bytesInKbps", 7320);
        tgwEntry.put("bytesOutKbps", 4290);
        tgwEntry.put("packetsDropped", 0);
        tgwEntry.put("ecmpEnabled", true);
        tgwEntry.put("state", "Available");
        List<Map<String, Object>> tgwMetrics = List.of(tgwEntry);

        List<Map<String, Object>> recentEvents = List.of(
                Map.of(
                        "time", "2026-10-03T22:45:10Z",
                        "event", "TGW Route Propagation Verified",
                        "resource", "Enterprise-TGW",
                        "severity", "info"
                ),
                Map.of(
                        "time", "2026-10-03T21:12:04Z",
                        "event", "Cross-VPC Synthetic Probe: DEV → TEST [SUCCESS 1.2ms]",
                        "resource", "Dev-App-Server",
                        "severity", "info"
                ),
                Map.of(
                        "time", "2026-10-03T20:30:19Z",
                        "event", "Security Group Rule Audit: Prod-App-SG PASS",
                        "resource", "Prod-App-SG",
                        "severity", "info"
                ),
                Map.of(
                        "time", "2026-10-03T19:15:42Z",
                        "event", "Flow Log Recommendation: Enable TGW Flow Logs to S3",
                        "resource", "Enterprise-TGW",
                        "severity", "warning"
                )
        );

        return new MonitoringResponse(
                94.0,
                1.3,
                0.0,
                1,
                "Healthy",
                vpcMetrics,
                tgwMetrics,
                recentEvents,
                Instant.now().toString()
        );
    }
}
