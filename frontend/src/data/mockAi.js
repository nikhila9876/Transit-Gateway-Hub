/**
 * Realistic AI Assistant Responses for CloudNexus Intelligence
 * Diagnostic network-analysis coverage:
 * - Route mismatch
 * - Security group restriction
 * - Unhealthy attachment
 * - Connectivity issue
 * - Recommended troubleshooting steps
 */

export const SUGGESTED_QUESTIONS = [
  "Why can't DEV reach PROD directly?",
  "What causes route mismatch in Transit Gateway?",
  "Explain security group restriction between DEV and PROD.",
  "How to detect an unhealthy TGW attachment?",
  "Troubleshooting steps for cross-VPC connectivity issues?",
  "Explain my Transit Gateway topology."
];

export const MOCK_AI_STRUCTURED_RESPONSES = {
  "route mismatch": {
    summary: "Route Mismatch Detected: When subnet route table entries and Transit Gateway route propagations diverge, asymmetric routing or packet drops occur.",
    evidence: "DEV Subnet RT (rtb-0dev-public) targets 10.30.0.0/16 -> tgw-09e8712a34bc56df0. If Enterprise-TGW route table lacks an active propagation for attachment tgw-attach-0prod0789, packets enter a blackhole state.",
    possibleCause: "TGW Route Table propagation was either disabled or association was pointed to an unattached secondary route table.",
    recommendedChecks: [
      "Check Transit Gateway Route Tables tab for unpropagated or blackhole CIDRs.",
      "Verify return route exists in destination VPC: Prod-Public-RT must have 10.10.0.0/16 -> Enterprise-TGW.",
      "Check `AWS_TransitGateway_RouteTable` metrics for DropPacketCount."
    ],
    recommendedAction: "Ensure bidirectional route consistency: Both source and destination subnet route tables must contain target CIDR entries pointing to Enterprise-TGW.",
    model: "CloudNexus-Network-Architect-v1"
  },
  "security group restriction": {
    summary: "Security Group Restriction Policy Active: Prod-App-SG explicitly drops direct inbound connections from DEV VPC (10.10.0.0/16).",
    evidence: "Security Group Prod-App-SG (sg-0prod887766) on Prod-App-Server enforces inbound TCP 8080 strictly from 10.20.0.0/16 (TEST VPC). Any ingress originating from 10.10.0.0/16 is dropped silently at the virtual interface.",
    possibleCause: "Enterprise Zero-Trust compliance boundary: Direct developer access to production workloads is strictly prohibited by architectural policy.",
    recommendedChecks: [
      "Review Prod-App-SG ingress rules in Security Center finding SEC-001.",
      "Validate that DEV connects to TEST (10.20.1.88) and TEST connects to PROD (10.30.1.112).",
      "Inspect VPC Flow Logs for REJECT records on ENI attached to Prod-App-Server."
    ],
    recommendedAction: "Maintain strict environment separation. Workloads should flow DEV -> TEST -> PROD through approved integration pipelines rather than direct cross-environment ingress.",
    model: "CloudNexus-Security-Analyzer-v1"
  },
  "unhealthy attachment": {
    summary: "Transit Gateway Attachment Health Assessment: An attachment enters 'pending' or 'failed' state if the designated attachment subnet lacks ENI capacity or route table association.",
    evidence: "Dev-TGW-Attachment (tgw-attach-0dev0123), Test-TGW-Attachment (tgw-attach-0test0456), and Prod-TGW-Attachment (tgw-attach-0prod0789) are currently in Available state with 100% route association.",
    possibleCause: "Subnet CIDR exhaustion, deleted VPC endpoint ENI, or misconfigured AZ subnet mappings.",
    recommendedChecks: [
      "Navigate to Transit Gateway > Attachments tab to inspect attachment state and subnet IDs.",
      "Verify at least 1 public or private subnet per Availability Zone is mapped to the TGW attachment.",
      "Check AWS CloudWatch metric `BytesIn` and `BytesOut` per attachment to detect zero-traffic anomalies."
    ],
    recommendedAction: "If an attachment shows 'failed', recreate the attachment mapped to an active subnet in us-east-1a, then re-associate with the Enterprise-TGW default route table.",
    model: "CloudNexus-Infrastructure-Auditor-v1"
  },
  "connectivity issue": {
    summary: "Cross-VPC Connectivity Diagnostic: Analysis of synthetic TCP/HTTP probes across the Enterprise-TGW backbone.",
    evidence: "DEV -> TEST probe succeeded (HTTP 200, 1.2ms latency). TEST -> PROD probe succeeded (HTTP 200, 1.4ms latency). DEV -> PROD probe failed (HTTP 403 / Connection Timeout).",
    possibleCause: "Intentional Zero-Trust policy: DEV to PROD is restricted by Prod-App-SG, while DEV to TEST and TEST to PROD remain fully reachable.",
    recommendedChecks: [
      "Open the Connectivity Tester and execute synthetic tests between DEV, TEST, and PROD.",
      "Inspect the evaluated hop-by-hop network evidence path.",
      "Confirm destination service on port 8080 is running via SSM Session Manager."
    ],
    recommendedAction: "For valid cross-VPC communication, route traffic through the TEST VPC intermediate staging service.",
    model: "CloudNexus-DiagnosticEngine-v1"
  },
  "troubleshooting steps": {
    summary: "AWS Multi-VPC Transit Gateway 5-Step Systematic Troubleshooting Guide:",
    evidence: "Standard enterprise diagnostic sequence for resolving packet drops across AWS Transit Gateway topologies.",
    possibleCause: "Common failure points include missing route table entries, asymmetric return paths, Security Group rules, or subnet Network ACLs.",
    recommendedChecks: [
      "Step 1 (Source Route Table): Ensure source VPC subnet route table has target CIDR pointing to Enterprise-TGW.",
      "Step 2 (TGW Route Table): Verify Enterprise-TGW has propagated route for destination CIDR pointing to correct attachment.",
      "Step 3 (Destination Route Table): Ensure destination VPC subnet route table has return route pointing back to source CIDR via TGW.",
      "Step 4 (Security Groups): Verify destination ENI security group permits inbound traffic from source CIDR on desired port.",
      "Step 5 (NACL & OS): Check stateless Network ACLs allow ephemeral ports (1024-65535) and OS service is listening."
    ],
    recommendedAction: "Execute tests in the Connectivity Tester to identify which hop fails in the network path.",
    model: "CloudNexus-Troubleshooting-Expert-v1"
  },
  "why can't dev reach prod": {
    summary: "DEV cannot directly communicate with PROD because Prod-App-SG strictly isolates PROD from DEV direct ingress on port 8080.",
    evidence: "Enterprise-TGW route table has active routes for both 10.10.0.0/16 and 10.30.0.0/16. However, Prod-App-SG (sg-0prod887766) ingress rules only allow 10.20.0.0/16 (TEST VPC).",
    possibleCause: "Zero-Trust policy enforcement preventing unauthorized developer access to production assets.",
    recommendedChecks: [
      "Inspect Security Center finding SEC-001 for details on the Dev-to-Prod isolation policy.",
      "Review Prod-App-SG inbound rules.",
      "Use Connectivity Tester to verify DEV -> PROD returns Restricted / Blocked status."
    ],
    recommendedAction: "Maintain strict environment separation. Workloads should flow DEV -> TEST -> PROD through approved integration pipelines.",
    model: "CloudNexus-Security-Analyzer-v1"
  },
  "why can't dev reach test": {
    summary: "DEV and TEST have full network reachability through Enterprise-TGW on HTTP port 8080. If connectivity fails, it is typically due to local service binding or firewall state.",
    evidence: "Route table rtb-0dev-public points 10.20.0.0/16 to Enterprise-TGW. TGW route table has active propagated route to Test-TGW-Attachment. Test-App-SG permits port 8080 from 10.10.0.0/16.",
    possibleCause: "Application service on Test-App-Server (10.20.1.88) not listening on port 8080, or local iptables filtering inbound packets.",
    recommendedChecks: [
      "Verify systemd service status on Test-App-Server: `systemctl status httpd` or `curl localhost:8080` via SSM Session Manager.",
      "Inspect Test-App-SG (sg-0test887766) inbound rules to ensure 10.10.0.0/16 on TCP 8080 is enabled.",
      "Check Transit Gateway attachment state for subnet-0test-pub in us-east-1a."
    ],
    recommendedAction: "Use the CloudNexus Connectivity Tester to run a synthetic TCP probe from DEV to TEST. Normal probe latency is ~1.2ms.",
    model: "CloudNexus-DiagnosticEngine-v1"
  },
  "explain my transit gateway topology": {
    summary: "CloudNexus operates a central Hub-and-Spoke topology anchored by Enterprise-TGW (tgw-09e8712a34bc56df0) in us-east-1, interconnecting three isolated VPC environments.",
    evidence: "3 VPC attachments are active: DEV (10.10.0.0/16), TEST (10.20.0.0/16), and PROD (10.30.0.0/16). Each VPC associates a public subnet with the TGW ENI. ASN 64512 with VPN ECMP enabled.",
    possibleCause: "Topology is operating nominally with dynamic route propagation enabled across all 3 CIDR blocks.",
    recommendedChecks: [
      "Review Transit Gateway Route Table propagation entries.",
      "Verify zero blackhole or unassociated routes exist in TGW route table.",
      "Confirm subnet route table entries point target CIDRs to the TGW ID."
    ],
    recommendedAction: "Navigate to the Network Topology visualizer to interact with the real-time graph and inspect individual VPC attachment details.",
    model: "CloudNexus-Network-Architect-v1"
  }
};

export const getStructuredAiResponse = (query) => {
  const q = (query || '').toLowerCase().trim();
  for (const [key, response] of Object.entries(MOCK_AI_STRUCTURED_RESPONSES)) {
    if (q.includes(key) || key.includes(q)) {
      return response;
    }
  }

  // Fallback intelligent response
  return {
    summary: `CloudNexus analyzed your query: "${query}". The multi-VPC environment features DEV (10.10.0.0/16), TEST (10.20.0.0/16), and PROD (10.30.0.0/16) connected via Enterprise-TGW.`,
    evidence: "Route propagation is active across all 3 attachments. Security policy strictly enforces separation between DEV and PROD while permitting DEV↔TEST and TEST↔PROD on port 8080.",
    possibleCause: "Query matched general infrastructure configuration rather than a specific fault pattern.",
    recommendedChecks: [
      "Check the Network Topology view for an interactive map of VPC attachments.",
      "Review the Security Center findings for identified posture recommendations.",
      "Execute a probe in the Connectivity Tester to validate live path reachability."
    ],
    recommendedAction: "Select one of the suggested questions or ask about specific CIDR ranges, route tables, or security group rules.",
    model: "CloudNexus-Network-Architect-v1"
  };
};

export default {
  SUGGESTED_QUESTIONS,
  MOCK_AI_STRUCTURED_RESPONSES,
  getStructuredAiResponse
};
