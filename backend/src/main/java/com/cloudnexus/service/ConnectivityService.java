package com.cloudnexus.service;

import com.cloudnexus.dto.ConnectivityTestRequest;
import com.cloudnexus.dto.ConnectivityTestResponse;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Service
public class ConnectivityService {

    public ConnectivityTestResponse testConnectivity(ConnectivityTestRequest request) {
        String source = request.getSourceVpc().toUpperCase();
        String destination = request.getDestinationVpc().toUpperCase();
        int port = request.getPort() > 0 ? request.getPort() : 8080;

        // Simulate DEV → PROD blocked by Prod-App-SG policy
        if ("DEV".equals(source) && "PROD".equals(destination)) {
            return new ConnectivityTestResponse(
                    "BLOCKED", 403,
                    "Connection timed out / rejected by Prod-App-SG policy. DEV cannot reach PROD directly on port " + port + ".",
                    null,
                    List.of(
                            "DEV (10.10.1.45)",
                            "Enterprise-TGW (tgw-09e8...)",
                            "PROD (10.30.1.112:" + port + ") [BLOCKED SG]"
                    ),
                    Instant.now().toString()
            );
        }

        // All other cross-VPC connections allowed
        String targetIp = "TEST".equals(destination) ? "10.20.1.88" : "10.30.1.112";
        String responseMsg = "TEST".equals(destination) ? "HELLO FROM TEST VPC" : "HELLO FROM PROD VPC";
        double latencyMs = "DEV".equals(source) ? 1.2 : 1.4;

        return new ConnectivityTestResponse(
                "SUCCESS", 200,
                responseMsg,
                latencyMs,
                List.of(
                        source + " (EC2 Instance)",
                        "Enterprise-TGW (Transit Gateway Hub)",
                        destination + " (EC2 :" + port + ")"
                ),
                Instant.now().toString()
        );
    }
}
