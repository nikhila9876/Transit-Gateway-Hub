/**
 * Consolidated Mock Data Export
 * Re-exports modular mock data files for backward compatibility.
 */
export { MOCK_VPCS } from './mockVpcs';
export { MOCK_TRANSIT_GATEWAY, MOCK_ROUTE_TABLES } from './mockTransitGateway';
export { MOCK_EC2_INSTANCES } from './mockEc2';
export { MOCK_MONITORING } from './mockMonitoring';
export { MOCK_SECURITY, MOCK_SECURITY_FINDINGS } from './mockSecurity';
export { MOCK_AUDIT_LOGS } from './mockAudit';
export { SUGGESTED_QUESTIONS, MOCK_AI_STRUCTURED_RESPONSES, getStructuredAiResponse } from './mockAi';

import { MOCK_VPCS } from './mockVpcs';
import { MOCK_TRANSIT_GATEWAY, MOCK_ROUTE_TABLES } from './mockTransitGateway';
import { MOCK_EC2_INSTANCES } from './mockEc2';
import { MOCK_MONITORING } from './mockMonitoring';
import { MOCK_SECURITY, MOCK_SECURITY_FINDINGS } from './mockSecurity';
import { MOCK_AUDIT_LOGS } from './mockAudit';

export const MOCK_DASHBOARD_SUMMARY = {
  totalVpcs: 3,
  vpcCount: 3,
  transitGatewayStatus: "Available",
  transitGatewayName: "Enterprise-TGW",
  tgwAttachments: 3,
  attachmentCount: 3,
  ec2Instances: 3,
  ec2Count: 3,
  networkHealth: 94,
  securityFindings: 4,
  crossVpcConnectivity: "Optimal",
  activeAlerts: 1,
  totalSubnets: 6,
  region: "us-east-1",
  environmentBreakdown: [
    { name: "DEV", cidr: "10.10.0.0/16", status: "Healthy", instances: 1, color: "#3b82f6" },
    { name: "TEST", cidr: "10.20.0.0/16", status: "Healthy", instances: 1, color: "#06b6d4" },
    { name: "PROD", cidr: "10.30.0.0/16", status: "Warning", instances: 1, color: "#6366f1" }
  ],
  recentActivity: [
    {
      id: "act-1",
      user: "admin@cloudnexus.io",
      action: "Route Table Inspection",
      resource: "rtb-0dev-public",
      status: "SUCCESS",
      timestamp: "Just now",
      details: "Audited cross-VPC propagation rules for DEV (10.10.0.0/16)"
    },
    {
      id: "act-2",
      user: "engineer@cloudnexus.io",
      action: "Connectivity Test",
      resource: "DEV → TEST",
      status: "SUCCESS",
      timestamp: "5 min ago",
      details: "Cross-VPC HTTP handshake verified on port 8080 (1.2ms latency)"
    },
    {
      id: "act-3",
      user: "security-scanner",
      action: "Security Scan",
      resource: "Prod-App-SG",
      status: "WARNING",
      timestamp: "15 min ago",
      details: "Verified Zero-Trust isolation; flagged public subnet binding"
    },
    {
      id: "act-4",
      user: "admin@cloudnexus.io",
      action: "AI Analysis",
      resource: "Intelligence Engine",
      status: "SUCCESS",
      timestamp: "30 min ago",
      details: "Completed automated network reachability and policy audit"
    },
    {
      id: "act-5",
      user: "admin@cloudnexus.io",
      action: "User Login",
      resource: "Auth Service",
      status: "SUCCESS",
      timestamp: "1 hour ago",
      details: "Administrator authenticated via corporate session"
    }
  ]
};

export const MOCK_METRICS = {
  latencyHistory: MOCK_MONITORING.latencyHistory,
  throughput: MOCK_MONITORING.throughput,
  healthScore: 94,
  kpis: MOCK_MONITORING.kpis,
  ranges: MOCK_MONITORING.ranges,
  vpcMetrics: MOCK_MONITORING.vpcMetrics
};

export const MOCK_AI_RESPONSES = [
  {
    prompt: "DEV to PROD routing",
    response: "Traffic from DEV (10.10.0.0/16) destined for PROD (10.30.0.0/16) is routed through Enterprise-TGW according to Dev-Public-RT. However, Prod-App-SG restricts direct ingress on port 8080 from DEV CIDR, enforcing separation. Workloads flow DEV -> TEST -> PROD as required by policy."
  },
  {
    prompt: "Security posture assessment",
    response: "Overall posture is rated Strong (88/100). SSH port 22 is disabled across all nodes in favor of AWS Systems Manager Session Manager. TGW attachments are properly isolated. Key recommendation: Enable Transit Gateway flow logging to S3/CloudWatch."
  },
  {
    prompt: "Transit Gateway optimization",
    response: "Enterprise-TGW in us-east-1 is currently operating with 3 VPC attachments with ECMP enabled. Route tables have 0 blackhole routes. Latency between interconnected VPCs averages 1.2ms - 1.4ms."
  }
];

export default {
  MOCK_VPCS,
  MOCK_TRANSIT_GATEWAY,
  MOCK_ROUTE_TABLES,
  MOCK_EC2_INSTANCES,
  MOCK_MONITORING,
  MOCK_SECURITY,
  MOCK_SECURITY_FINDINGS,
  MOCK_AUDIT_LOGS,
  MOCK_DASHBOARD_SUMMARY,
  MOCK_METRICS,
  MOCK_AI_RESPONSES
};
