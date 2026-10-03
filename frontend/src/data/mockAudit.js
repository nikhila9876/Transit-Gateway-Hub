export const MOCK_AUDIT_LOGS = [
  {
    id: "aud-001",
    timestamp: "2026-10-04 00:52:14",
    user: "admin@cloudnexus.io",
    actor: "admin@cloudnexus.io",
    action: "AWS Synchronization",
    resource: "Enterprise-TGW",
    status: "SUCCESS",
    details: "Synchronized topology state and route tables across DEV, TEST, and PROD VPC attachments."
  },
  {
    id: "aud-002",
    timestamp: "2026-10-04 00:46:30",
    user: "admin@cloudnexus.io",
    actor: "admin@cloudnexus.io",
    action: "AI Analysis",
    resource: "CloudNexus Intelligence",
    status: "SUCCESS",
    details: "Ran automated network path validation for DEV (10.10.0.0/16) to PROD (10.30.0.0/16)."
  },
  {
    id: "aud-003",
    timestamp: "2026-10-04 00:35:18",
    user: "engineer@cloudnexus.io",
    actor: "engineer@cloudnexus.io",
    action: "Network Test",
    resource: "DEV → TEST (TCP 8080)",
    status: "SUCCESS",
    details: "Cross-VPC HTTP probe returned 200 OK with 1.2ms latency."
  },
  {
    id: "aud-004",
    timestamp: "2026-10-04 00:28:45",
    user: "engineer@cloudnexus.io",
    actor: "engineer@cloudnexus.io",
    action: "VPC Viewed",
    resource: "vpc-0prod1030003 (PROD)",
    status: "SUCCESS",
    details: "Inspected subnet routing and security group isolation policies on Prod-App-SG."
  },
  {
    id: "aud-005",
    timestamp: "2026-10-04 00:15:22",
    user: "admin@cloudnexus.io",
    actor: "admin@cloudnexus.io",
    action: "Dashboard Viewed",
    resource: "Console Overview",
    status: "SUCCESS",
    details: "Accessed multi-VPC executive monitoring dashboard and health metrics."
  },
  {
    id: "aud-006",
    timestamp: "2026-10-04 00:02:10",
    user: "admin@cloudnexus.io",
    actor: "admin@cloudnexus.io",
    action: "Login",
    resource: "Auth Service",
    status: "SUCCESS",
    details: "User authenticated via JWT session token from corporate gateway IP."
  },
  {
    id: "aud-007",
    timestamp: "2026-10-03 23:45:10",
    user: "admin@cloudnexus.io",
    actor: "admin@cloudnexus.io",
    action: "TRANSIT_GATEWAY_ROUTE_PROPAGATION_VERIFIED",
    resource: "Enterprise-TGW",
    status: "SUCCESS",
    details: "Verified route propagation for DEV (10.10.0.0/16), TEST (10.20.0.0/16), and PROD (10.30.0.0/16)."
  },
  {
    id: "aud-008",
    timestamp: "2026-10-03 22:30:19",
    user: "security-scanner",
    actor: "security-scanner",
    action: "Security Scan",
    resource: "Prod-App-SG",
    status: "WARNING",
    details: "Confirmed strict denial of DEV VPC traffic direct to PROD. Flagged public IP binding."
  },
  {
    id: "aud-009",
    timestamp: "2026-10-03 21:15:42",
    user: "session-manager",
    actor: "session-manager",
    action: "SSM_SESSION_STARTED",
    resource: "i-0dev123456789abcd",
    status: "SUCCESS",
    details: "Engineer logged in via AWS SSM Session Manager for connectivity verification."
  },
  {
    id: "aud-010",
    timestamp: "2026-10-03 20:05:00",
    user: "viewer@cloudnexus.io",
    actor: "viewer@cloudnexus.io",
    action: "Login",
    resource: "Auth Service",
    status: "SUCCESS",
    details: "Viewer role session initiated for read-only telemetry audit."
  }
];

export default MOCK_AUDIT_LOGS;
