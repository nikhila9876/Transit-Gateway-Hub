export const SUGGESTED_QUESTIONS = [
  "Why can't DEV reach TEST?",
  "Explain my Transit Gateway topology.",
  "Are there any security risks?",
  "Which resources need attention?",
  "What routes connect DEV and TEST?",
  "What should I check if connectivity fails?"
];

export const MOCK_AI_STRUCTURED_RESPONSES = {
  "why can't dev reach test": {
    summary: "DEV and TEST have full network reachability through Enterprise-TGW on HTTP port 8080. However, if connectivity fails, it is typically due to security group ingress rules or local firewall state on Test-App-Server.",
    evidence: "Route table rtb-0dev-public points 10.20.0.0/16 to tgw-09e8712a34bc56df0. TGW route table has active propagated route to tgw-attach-0test0456. Test-App-SG permits port 8080 from 10.10.0.0/16.",
    possibleCause: "Workload application on Test-App-Server (10.20.1.88) not listening on port 8080, or local iptables filtering inbound syn packets.",
    recommendedChecks: [
      "Verify systemd service status on Test-App-Server: `systemctl status httpd` or `curl localhost:8080` via SSM Session Manager.",
      "Inspect Test-App-SG (sg-0test887766) inbound rules to ensure 10.10.0.0/16 on TCP 8080 is enabled.",
      "Check Transit Gateway attachment state for subnet-0test-pub in us-east-1a."
    ],
    recommendedAction: "Use the CloudNexus Connectivity Tester to run a synthetic TCP probe from DEV to TEST. If ping fails, connect to Test-App-Server via SSM and verify service binding."
  },
  "explain my transit gateway topology": {
    summary: "CloudNexus operates a central Hub-and-Spoke topology anchored by Enterprise-TGW (tgw-09e8712a34bc56df0) in us-east-1, interconnecting three isolated VPC environments.",
    evidence: "3 VPC attachments are active: DEV (10.10.0.0/16), TEST (10.20.0.0/16), and PROD (10.30.0.0/16). Each VPC associates a public subnet with the TGW ENI. ASN 64512 with VPN ECMP enabled.",
    possibleCause: "N/A — Topology is operating nominally with dynamic route propagation enabled across all 3 CIDR blocks.",
    recommendedChecks: [
      "Review Transit Gateway Route Table propagation entries.",
      "Verify zero blackhole or unassociated routes exist in TGW route table.",
      "Confirm subnet route table entries point target CIDRs to the TGW ID."
    ],
    recommendedAction: "Navigate to the Network Topology visualizer to interact with the real-time graph and inspect individual VPC attachment details."
  },
  "are there any security risks": {
    summary: "Network security posture is scored at 86/100. While DEV to PROD direct traffic is properly blocked by Prod-App-SG policy, there are 2 warnings and 3 informational hygiene items requiring architectural attention.",
    evidence: "DEV VPC cannot communicate directly with PROD (strictly isolated). SSH Port 22 is hardened across all nodes. However, Prod-App-Server resides in a public subnet with a public IP, and TGW Flow Logs are currently disabled.",
    possibleCause: "Initial deployment placed application nodes in public subnets with Internet Gateways for ease of learner access.",
    recommendedChecks: [
      "Examine finding SEC-002: Broad inbound rule on Dev-App-SG allowing 0.0.0.0/0 on port 8080.",
      "Inspect finding SEC-003: Prod-App-Server public IP 52.90.87.64 in subnet-0prod-pub.",
      "Check CloudWatch TGW flow log subscription status."
    ],
    recommendedAction: "Migrate production workloads to private subnets with NAT Gateway egress, and enable Transit Gateway Flow Logs to S3 for continuous compliance."
  },
  "which resources need attention": {
    summary: "Two resources currently require operational attention: Prod-VPC (public subnet workload exposure) and Enterprise-TGW (missing flow log instrumentation).",
    evidence: "VPC Explorer shows PROD status as 'Warning'. Security finding SEC-002 reports Dev-App-SG broad ingress. Security finding SEC-003 reports Prod-App-Server public exposure.",
    possibleCause: "Subnet architecture in PROD lacks private tier isolation; security group rule on DEV has 0.0.0.0/0 ingress for initial lab onboarding.",
    recommendedChecks: [
      "Prod-VPC (vpc-0prod1030003): Verify database and app instances can move to subnet-0prod-priv (10.30.2.0/24).",
      "Dev-App-SG (sg-0dev887766): Restrict port 8080 ingress to 10.10.0.0/16 and 10.20.0.0/16."
    ],
    recommendedAction: "Review the Security Center finding cards and apply recommended security group scope reductions."
  },
  "what routes connect dev and test": {
    summary: "DEV and TEST VPCs are interconnected via a two-stage routing path: Subnet Route Table (rtb-0dev-public) forwards 10.20.0.0/16 to Enterprise-TGW, which propagates packets to attachment tgw-attach-0test0456.",
    evidence: "Dev-Public-RT: Destination 10.20.0.0/16 -> Target tgw-09e8712a34bc56df0 (Active). Enterprise-TGW Route Table: Destination 10.20.0.0/16 -> Target tgw-attach-0test0456 (Propagated, Active).",
    possibleCause: "N/A — Routing path is active and verified with 1.2ms round-trip latency.",
    recommendedChecks: [
      "Check return route on Test-Public-RT: Destination 10.10.0.0/16 -> Target Enterprise-TGW (Active).",
      "Verify bidirectional packet flow across Transit Gateway attachments."
    ],
    recommendedAction: "Check the Route Tables page to view complete route tables and subnet associations for both DEV and TEST."
  },
  "what should i check if connectivity fails": {
    summary: "When cross-VPC packets drop or time out, systematically evaluate the four-point AWS transit inspection checklist: Subnet Routes, TGW Route Propagation, Security Groups, and OS Firewall.",
    evidence: "In AWS Transit Gateway architectures, 90% of connectivity failures stem from missing return routes in the destination VPC route table or asymmetric security group rules.",
    possibleCause: "Missing return route in destination VPC route table, security group blocking caller's CIDR, or network ACL denying ephemeral ports (1024-65535).",
    recommendedChecks: [
      "1. Route Tables: Verify BOTH source and destination route tables have routes pointing to Enterprise-TGW.",
      "2. Security Groups: Verify destination SG allows inbound traffic from source VPC CIDR on required port (e.g. 8080).",
      "3. TGW Attachments: Confirm attachment state is 'Available' and associated with TGW Route Table.",
      "4. Network ACLs: Ensure stateless NACLs allow inbound and ephemeral outbound return traffic."
    ],
    recommendedAction: "Run a test in the Connectivity Tester to pinpoint whether failure is at routing hop 1 (TGW) or hop 2 (Target SG/OS)."
  }
};

export const getStructuredAiResponse = (query) => {
  const q = query.toLowerCase().trim();
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
    recommendedAction: "Select one of the suggested queries or ask about specific CIDR ranges, route tables, or security group rules."
  };
};

export default {
  SUGGESTED_QUESTIONS,
  MOCK_AI_STRUCTURED_RESPONSES,
  getStructuredAiResponse
};
