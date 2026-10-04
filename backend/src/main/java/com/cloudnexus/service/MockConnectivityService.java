package com.cloudnexus.service;

import com.cloudnexus.dto.ConnectivityTestRequest;
import com.cloudnexus.dto.ConnectivityTestResponse;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

/**
 * Mock implementation of {@link ConnectivityService}.
 * Evaluates architectural routing rules and returns simulated connectivity diagnostics.
 * Explicitly identifies outputs as development mock simulation.
 */
@Service
@ConditionalOnProperty(name = "cloudnexus.data-source", havingValue = "mock")
public class MockConnectivityService implements ConnectivityService {

    @Override
    public ConnectivityTestResponse testConnectivity(ConnectivityTestRequest request) {
        String source = request.getSource() != null ? request.getSource().toUpperCase() : "DEV";
        String destination = request.getDestination() != null ? request.getDestination().toUpperCase() : "TEST";
        String protocol = request.getProtocol() != null ? request.getProtocol().toUpperCase() : "TCP";
        int port = request.getPort() > 0 ? request.getPort() : 8080;
        String now = Instant.now().toString();

        // Architectural rule: Strict isolation blocks DEV directly reaching PROD
        if (source.contains("DEV") && destination.contains("PROD")) {
            return new ConnectivityTestResponse(
                    source,
                    destination,
                    protocol,
                    port,
                    "BLOCKED",
                    403,
                    "Connection Dropped: Strict isolation policy active between DEV and PROD VPCs (MOCK SIMULATION)",
                    null,
                    List.of(
                            source + " (10.10.1.45)",
                            "Enterprise-TGW (Central Route Table)",
                            "Prod-App-SG (DROP: Rule non-whitelisted)"
                    ),
                    now,
                    "MOCK-RULE-ENGINE",
                    "SECURITY_GROUP_BLOCK",
                    List.of(
                            "Review destination Security Group ingress rules in PROD VPC",
                            "Verify traffic routing passes through TEST staging environment",
                            "Check VPC Flow Logs for rejected TCP SYN packets"
                    )
            );
        }

        // Standard reachable multi-VPC paths (DEV -> TEST or TEST -> PROD)
        double latency = Math.round((1.0 + Math.random() * 0.8) * 10.0) / 10.0;
        String destIp = destination.contains("TEST") ? "10.20.1.88" : "10.30.1.112";
        String sourceIp = source.contains("TEST") ? "10.20.1.88" : "10.10.1.45";

        return new ConnectivityTestResponse(
                source,
                destination,
                protocol,
                port,
                "SUCCESS",
                200,
                "TCP handshake successful on port " + port + " across Enterprise-TGW (MOCK SIMULATION)",
                latency,
                List.of(
                        source + " (" + sourceIp + ")",
                        "Enterprise-TGW Hub Route Propagation",
                        destination + " (" + destIp + ":" + port + ")"
                ),
                now,
                "MOCK-RULE-ENGINE",
                null,
                List.of(
                        "Verify listener process is active on target port " + port,
                        "Monitor Transit Gateway CloudWatch bytes in/out metrics"
                )
        );
    }
}
