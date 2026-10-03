package com.cloudnexus.service;

import com.cloudnexus.dto.AiAnalyzeRequest;
import com.cloudnexus.dto.AiAnalyzeResponse;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Map;

@Service
public class AiService {

    private static final Map<String, String> KNOWLEDGE_BASE = Map.of(
        "routing", "Traffic from DEV (10.10.0.0/16) destined for PROD (10.30.0.0/16) is routed through Enterprise-TGW according to Dev-Public-RT. However, Prod-App-SG restricts direct ingress on port 8080 from DEV CIDR, enforcing separation. Workloads flow DEV -> TEST -> PROD as required by policy.",
        "security", "Overall posture is rated Strong (94/100). SSH port 22 is disabled across all nodes in favor of AWS Systems Manager Session Manager. TGW attachments are properly isolated. Key recommendation: Enable Transit Gateway flow logging to S3/CloudWatch.",
        "transit", "Enterprise-TGW in us-east-1 is currently operating with 3 VPC attachments with ECMP enabled. Route tables have 0 blackhole routes. Latency between interconnected VPCs averages 1.2ms - 1.4ms.",
        "vpc", "Three VPCs are configured: DEV (10.10.0.0/16), TEST (10.20.0.0/16), and PROD (10.30.0.0/16). Each is connected to Enterprise-TGW via dedicated attachments. Route propagation is enabled for all three CIDR blocks.",
        "connectivity", "Cross-VPC connectivity allows DEV to reach TEST on port 8080, and TEST to reach PROD on port 8080. DEV to PROD direct traffic is blocked by Prod-App-SG security group isolation policy.",
        "monitoring", "CloudWatch integration is planned for Phase 2. Currently monitoring metrics are simulated. Latency averages 1.2ms for DEV-TEST and 1.4ms for TEST-PROD paths. Packet loss is 0%.",
        "optimization", "Enterprise-TGW with 3 attachments is operating efficiently. ECMP support provides load distribution. Consider enabling TGW flow logs for better observability and enabling VPC Flow Logs for each VPC.",
        "subnets", "Each VPC has 2 subnets: public (10.x.1.0/24) and private (10.x.2.0/24). Internet Gateways (Dev-IGW, Test-IGW, Prod-IGW) are attached to public subnets. Private subnets are reserved for internal workloads."
    );

    public AiAnalyzeResponse analyze(AiAnalyzeRequest request) {
        String prompt = request.getPrompt().toLowerCase();
        String analysis = findBestMatch(prompt);

        return new AiAnalyzeResponse(
                request.getPrompt(),
                analysis,
                "CloudNexus-Network-Intelligence-Engine-v1",
                0.97,
                Instant.now().toString()
        );
    }

    private String findBestMatch(String prompt) {
        if (prompt.contains("rout") || prompt.contains("prod") || prompt.contains("dev to")) {
            return KNOWLEDGE_BASE.get("routing");
        } else if (prompt.contains("secur") || prompt.contains("posture") || prompt.contains("finding")) {
            return KNOWLEDGE_BASE.get("security");
        } else if (prompt.contains("transit") || prompt.contains("tgw") || prompt.contains("gateway")) {
            return KNOWLEDGE_BASE.get("transit");
        } else if (prompt.contains("connect") || prompt.contains("reach") || prompt.contains("curl")) {
            return KNOWLEDGE_BASE.get("connectivity");
        } else if (prompt.contains("monitor") || prompt.contains("metric") || prompt.contains("latency")) {
            return KNOWLEDGE_BASE.get("monitoring");
        } else if (prompt.contains("optim") || prompt.contains("improv") || prompt.contains("recommend")) {
            return KNOWLEDGE_BASE.get("optimization");
        } else if (prompt.contains("subnet") || prompt.contains("cidr") || prompt.contains("network")) {
            return KNOWLEDGE_BASE.get("subnets");
        } else if (prompt.contains("vpc")) {
            return KNOWLEDGE_BASE.get("vpc");
        } else {
            return "The CloudNexus platform manages a multi-VPC AWS environment with DEV (10.10.0.0/16), TEST (10.20.0.0/16), and PROD (10.30.0.0/16) connected via Enterprise-TGW. Security policy allows DEV↔TEST and TEST↔PROD on port 8080. DEV to PROD direct access is blocked by Prod-App-SG. All servers use SSM Session Manager for administration.";
        }
    }
}
