package com.cloudnexus.service;

import com.cloudnexus.dto.AiAnalysisRequest;
import com.cloudnexus.dto.AiAnalysisResponse;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

/**
 * Mock implementation of {@link AiService}.
 * Provides structured diagnostic analysis answering VPC reachability and policy questions.
 */
@Service
@ConditionalOnProperty(name = "cloudnexus.data-source", havingValue = "mock")
public class MockAiService implements AiService {

    @Override
    public AiAnalysisResponse analyzeNetwork(AiAnalysisRequest request) {
        String q = request.getQuestion() != null ? request.getQuestion().toLowerCase() : "";
        String now = Instant.now().toString();

        if (q.contains("dev") && q.contains("prod")) {
            return new AiAnalysisResponse(
                    request.getQuestion(),
                    "Strict security group isolation policy active between DEV VPC and PROD VPC.",
                    "Prod-App-SG only permits inbound TCP port 8080 from TEST VPC CIDR (10.20.0.0/16). DEV VPC CIDR (10.10.0.0/16) is intentionally not whitelisted.",
                    "Zero-Trust multi-environment compliance policy: development workloads are prevented from directly mutating production services.",
                    List.of(
                            "Review inbound rules on Prod-App-SG (sg-0prod887766)",
                            "Verify Enterprise-TGW route propagation in the Central Route Table",
                            "Inspect VPC Flow Logs for rejected SYN packets on TCP 8080"
                    ),
                    "Deploy intermediate service in TEST VPC to act as the deployment gateway, or submit a security exception to whitelist DEV CIDR.",
                    "Analysis: DEV to PROD traffic is rejected at the destination security group layer.",
                    "CloudNexus-MockAI-v1",
                    0.98,
                    now
            );
        }

        // Default or general diagnostic
        return new AiAnalysisResponse(
                request.getQuestion(),
                "Transit Gateway Hub route propagation is operating normally across all connected VPCs.",
                "All 3 attachments (Dev-TGW-Attachment, Test-TGW-Attachment, Prod-TGW-Attachment) report status 'Available'.",
                "Ensure target security groups have matching inbound rules and the listener application is bound to 0.0.0.0.",
                List.of(
                        "Verify EC2 listener process state via SSM Session Manager",
                        "Check VPC local route tables contain 0.0.0.0/0 or specific CIDR pointing to Enterprise-TGW",
                        "Confirm security group ingress rules on the target port"
                ),
                "Execute synthetic probe via POST /api/network/test to isolate hop-by-hop latency and status.",
                "Analysis: Core network backbone is healthy; any connection failure is likely security group or application port bound.",
                "CloudNexus-MockAI-v1",
                0.95,
                now
        );
    }
}
