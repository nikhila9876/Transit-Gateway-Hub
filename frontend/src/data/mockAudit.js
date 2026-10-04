/**
 * Realistic Compliance Audit Logs for CloudNexus
 * Explicitly covers:
 * - User login
 * - VPC inspection
 * - Route table inspection
 * - Connectivity test
 * - Security scan
 * - AI analysis
 */

export const MOCK_AUDIT_LOGS = [
  {
    id: "aud-001",
    timestamp: "2026-10-04 09:12:15",
    user: "admin@cloudnexus.io",
    actor: "admin@cloudnexus.io",
    action: "User Login",
    resource: "Auth Service (JWT)",
    status: "SUCCESS",
    details: "Administrator authenticated via corporate session with ROLE_ADMIN privileges."
  },
  {
    id: "aud-002",
    timestamp: "2026-10-04 09:08:40",
    user: "admin@cloudnexus.io",
    actor: "admin@cloudnexus.io",
    action: "Route Table Inspection",
    resource: "rtb-0dev-public (Dev-Public-RT)",
    status: "SUCCESS",
    details: "Audited routes: 10.10.0.0/16 (local), 10.20.0.0/16 (Enterprise-TGW), 10.30.0.0/16 (Enterprise-TGW)."
  },
  {
    id: "aud-003",
    timestamp: "2026-10-04 09:05:22",
    user: "engineer@cloudnexus.io",
    actor: "engineer@cloudnexus.io",
    action: "VPC Inspection",
    resource: "vpc-0prod1030003 (Prod-VPC)",
    status: "SUCCESS",
    details: "Inspected subnet CIDRs (10.30.1.0/24, 10.30.2.0/24) and TGW attachment Prod-TGW-Attachment."
  },
  {
    id: "aud-004",
    timestamp: "2026-10-04 08:58:10",
    user: "engineer@cloudnexus.io",
    actor: "engineer@cloudnexus.io",
    action: "Connectivity Test",
    resource: "DEV (10.10.1.45) → TEST (10.20.1.88:8080)",
    status: "SUCCESS",
    details: "Cross-VPC TCP handshake probe succeeded via Enterprise-TGW with 1.2ms latency."
  },
  {
    id: "aud-005",
    timestamp: "2026-10-04 08:45:33",
    user: "security-scanner",
    actor: "security-scanner",
    action: "Security Scan",
    resource: "Prod-App-SG (sg-0prod887766)",
    status: "WARNING",
    details: "Confirmed strict denial of DEV VPC traffic direct to PROD. Flagged public IP binding on Prod-App-Server."
  },
  {
    id: "aud-006",
    timestamp: "2026-10-04 08:30:18",
    user: "admin@cloudnexus.io",
    actor: "admin@cloudnexus.io",
    action: "AI Analysis",
    resource: "CloudNexus Intelligence Engine",
    status: "SUCCESS",
    details: "Executed AI automated root cause analysis for DEV-to-PROD isolation rules and route tables."
  },
  {
    id: "aud-007",
    timestamp: "2026-10-04 08:15:00",
    user: "viewer@cloudnexus.io",
    actor: "viewer@cloudnexus.io",
    action: "User Login",
    resource: "Auth Service (JWT)",
    status: "SUCCESS",
    details: "Viewer session authenticated with read-only ROLE_VIEWER telemetry permissions."
  },
  {
    id: "aud-008",
    timestamp: "2026-10-04 07:50:12",
    user: "admin@cloudnexus.io",
    actor: "admin@cloudnexus.io",
    action: "AWS Synchronization",
    resource: "Enterprise-TGW",
    status: "SUCCESS",
    details: "Synchronized topology state and route tables across DEV, TEST, and PROD VPC attachments."
  },
  {
    id: "aud-009",
    timestamp: "2026-10-03 23:40:05",
    user: "session-manager",
    actor: "session-manager",
    action: "SSM_SESSION_STARTED",
    resource: "i-0dev123456789abcd (Dev-App-Server)",
    status: "SUCCESS",
    details: "Engineer logged in via AWS SSM Session Manager for connectivity verification."
  },
  {
    id: "aud-010",
    timestamp: "2026-10-03 22:15:00",
    user: "admin@cloudnexus.io",
    actor: "admin@cloudnexus.io",
    action: "Dashboard Viewed",
    resource: "Console Overview",
    status: "SUCCESS",
    details: "Accessed multi-VPC executive monitoring dashboard and health metrics."
  }
];

export default MOCK_AUDIT_LOGS;
