/**
 * Centralized CloudNexus Mock Services Layer
 *
 * Provides immediate, zero-latency AWS mock service implementations
 * with 100% response shape compatibility matching the Spring Boot REST backend.
 *
 * Used during DEMO MODE (VITE_USE_MOCK_DATA=true) or as an instant fallback
 * when the backend server is offline, eliminating infinite loading states.
 */

import {
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
  getStructuredAiResponse,
} from '../data/mockData';

export const mockDashboardService = {
  async getSummary() {
    return Promise.resolve({ ...MOCK_DASHBOARD_SUMMARY });
  },
};

export const mockVpcService = {
  async getVpcs() {
    return Promise.resolve([...MOCK_VPCS]);
  },

  async getVpcById(id) {
    const found = MOCK_VPCS.find(
      (v) => v.id === id || v.name?.toLowerCase() === id?.toLowerCase() || v.displayName?.toLowerCase() === id?.toLowerCase()
    );
    if (found) return Promise.resolve({ ...found });
    return Promise.reject(new Error(`VPC with id ${id} not found`));
  },
};

export const mockTransitGatewayService = {
  async getTransitGateway() {
    return Promise.resolve({ ...MOCK_TRANSIT_GATEWAY });
  },

  async getAttachments() {
    return Promise.resolve([...(MOCK_TRANSIT_GATEWAY.attachments || [])]);
  },

  async getRoutes() {
    return Promise.resolve([...(MOCK_TRANSIT_GATEWAY.routes || [])]);
  },
};

export const mockRouteTableService = {
  async getRouteTables() {
    return Promise.resolve([...MOCK_ROUTE_TABLES]);
  },
};

export const mockEc2Service = {
  async getInstances() {
    return Promise.resolve([...MOCK_EC2_INSTANCES]);
  },

  async getInstanceById(id) {
    const found = MOCK_EC2_INSTANCES.find((i) => i.id === id);
    return Promise.resolve(found ? { ...found } : null);
  },
};

export const mockConnectivityService = {
  async testConnectivity(source, destination, protocol = 'TCP', port = 8080) {
    const isDevToProd = source === 'DEV' && destination === 'PROD';
    const isDevToTest = source === 'DEV' && destination === 'TEST';
    const isTestToProd = source === 'TEST' && destination === 'PROD';

    if (isDevToProd) {
      return Promise.resolve({
        status: 'BLOCKED',
        statusCode: 403,
        displayStatus: 'Unreachable',
        result: 'Restricted',
        source: 'DEV',
        destination: 'PROD',
        protocol,
        port,
        latency: null,
        latencyMs: null,
        message: 'Restricted — Connection timed out / rejected by Prod-App-SG policy. DEV cannot reach PROD directly on port 8080.',
        diagnosticMessage: 'Enterprise-TGW propagated route exists, but destination security group Prod-App-SG strictly restricts inbound HTTP 8080 to 10.20.0.0/16 (TEST VPC). Packets originating from 10.10.0.0/16 are dropped.',
        diagnosticMethod: 'AWS-EC2-DESCRIBE & SG-SIMULATOR',
        possibleCause: 'Security Group Prod-App-SG Zero-Trust isolation rule.',
        evidence: [
          'DEV VPC Subnet Route Table: 10.30.0.0/16 -> Enterprise-TGW (Active)',
          'Enterprise-TGW Route Table: 10.30.0.0/16 -> Prod-TGW-Attachment (Propagated)',
          'Prod-App-SG Inbound Rules: TCP 8080 permitted ONLY from 10.20.0.0/16',
          'VPC Flow Logs: REJECT on ENI attached to Prod-App-Server (i-0prod123456789abcd)'
        ],
        recommendedChecks: [
          'Verify Prod-App-SG inbound rules (permits 10.20.0.0/16 only)',
          'Verify compliance requirement: Workloads must traverse TEST environment before PROD',
          'Review Transit Gateway route propagation table'
        ],
        path: [
          'DEV (10.10.1.45)',
          'Enterprise-TGW (tgw-09e8712a34bc56df0)',
          'Prod-TGW-Attachment (tgw-attach-0prod0789)',
          'Prod-App-SG [BLOCKED: Non-whitelisted CIDR 10.10.0.0/16]'
        ],
        timestamp: new Date().toLocaleTimeString(),
      });
    }

    if (isDevToTest) {
      return Promise.resolve({
        status: 'REACHABLE',
        statusCode: 200,
        displayStatus: 'Reachable',
        result: 'Connected',
        source: 'DEV',
        destination: 'TEST',
        protocol,
        port,
        latency: '1.2 ms',
        latencyMs: 1.2,
        message: 'Connected — Cross-VPC HTTP handshake successful via Enterprise-TGW.',
        diagnosticMessage: 'Enterprise-TGW successfully routed TCP packet from DEV (10.10.1.45) to TEST (10.20.1.88:8080). Service response: "HELLO FROM TEST VPC".',
        diagnosticMethod: 'AWS-EC2-DESCRIBE & TGW-ROUTE-PROBE',
        possibleCause: null,
        evidence: [
          'Dev-Public-RT: 10.20.0.0/16 -> Enterprise-TGW (Active)',
          'Enterprise-TGW: 10.20.0.0/16 -> Test-TGW-Attachment (Active)',
          'Test-App-SG: Permits TCP 8080 from 10.10.0.0/16 (Allow)',
          'Test-App-Server HTTP Service: 200 OK responded in 1.2ms'
        ],
        recommendedChecks: [
          'Routine telemetry monitoring via CloudWatch',
          'Validate latency stays under 5ms SLA'
        ],
        path: [
          'DEV (10.10.1.45)',
          'Enterprise-TGW (tgw-09e8712a34bc56df0)',
          'Test-TGW-Attachment (tgw-attach-0test0456)',
          'Test-App-Server (10.20.1.88:8080) [200 OK]'
        ],
        timestamp: new Date().toLocaleTimeString(),
      });
    }

    if (isTestToProd) {
      return Promise.resolve({
        status: 'REACHABLE',
        statusCode: 200,
        displayStatus: 'Reachable',
        result: 'Connected',
        source: 'TEST',
        destination: 'PROD',
        protocol,
        port,
        latency: '1.4 ms',
        latencyMs: 1.4,
        message: 'Connected — Cross-VPC HTTP handshake successful via Enterprise-TGW.',
        diagnosticMessage: 'Enterprise-TGW successfully routed TCP packet from TEST (10.20.1.88) to PROD (10.30.1.112:8080). Service response: "HELLO FROM PROD VPC".',
        diagnosticMethod: 'AWS-EC2-DESCRIBE & TGW-ROUTE-PROBE',
        possibleCause: null,
        evidence: [
          'Test-Public-RT: 10.30.0.0/16 -> Enterprise-TGW (Active)',
          'Enterprise-TGW: 10.30.0.0/16 -> Prod-TGW-Attachment (Active)',
          'Prod-App-SG: Permits TCP 8080 from 10.20.0.0/16 (Allow)',
          'Prod-App-Server HTTP Service: 200 OK responded in 1.4ms'
        ],
        recommendedChecks: [
          'Ensure production workload capacity is monitored in CloudWatch',
          'Verify SSL/TLS termination on production services'
        ],
        path: [
          'TEST (10.20.1.88)',
          'Enterprise-TGW (tgw-09e8712a34bc56df0)',
          'Prod-TGW-Attachment (tgw-attach-0prod0789)',
          'Prod-App-Server (10.30.1.112:8080) [200 OK]'
        ],
        timestamp: new Date().toLocaleTimeString(),
      });
    }

    // Default arbitrary cross-VPC test fallback
    return Promise.resolve({
      status: 'REACHABLE',
      statusCode: 200,
      displayStatus: 'Reachable',
      result: 'Connected',
      source,
      destination,
      protocol,
      port,
      latency: '1.3 ms',
      latencyMs: 1.3,
      message: `Connected — Cross-VPC handshake between ${source} and ${destination} completed.`,
      diagnosticMessage: `Packet propagated via Enterprise-TGW successfully to ${destination}.`,
      diagnosticMethod: 'AWS-EC2-DESCRIBE',
      possibleCause: null,
      evidence: [
        `Source VPC Route Table: Configured for Enterprise-TGW`,
        `TGW Route Propagation: Verified active`,
        `Destination Security Group: Ingress permits traffic`
      ],
      recommendedChecks: ['Monitor end-to-end latency'],
      path: [
        `${source} VPC Workload`,
        'Enterprise-TGW (tgw-09e8712a34bc56df0)',
        `${destination} VPC Target (: ${port})`
      ],
      timestamp: new Date().toLocaleTimeString(),
    });
  },
};

export const mockSecurityService = {
  async getFindings() {
    return Promise.resolve([...MOCK_SECURITY_FINDINGS]);
  },
};

export const mockMonitoringService = {
  async getMetrics() {
    return Promise.resolve({
      ...MOCK_METRICS,
      cpuUtilization: 14.2,
      avgLatencyMs: 1.2,
      instanceHealth: 100,
      availability: '99.98%',
      vpcMetrics: [
        { vpc: 'DEV VPC', latencyMs: 1.2, throughputMbps: 4.8 },
        { vpc: 'TEST VPC', latencyMs: 1.3, throughputMbps: 5.2 },
        { vpc: 'PROD VPC', latencyMs: 1.4, throughputMbps: 6.9 }
      ]
    });
  },
};

export const mockNetworkService = {
  async getNetworkHealth() {
    return Promise.resolve({
      overallScore: 94,
      status: 'HEALTHY',
      networkScore: 95,
      computeScore: 92,
      securityScore: 88,
      connectivityScore: 96,
      monitoringScore: 94,
      timestamp: new Date().toISOString(),
      reasons: [
        'Enterprise-TGW operational in us-east-1 with 3 active attachments',
        'All VPC route tables synchronized with 0 blackhole routes',
        'DEV to PROD isolation policy actively enforced by Prod-App-SG',
        'Zero dropped packets detected across Transit Gateway ENIs'
      ],
      resourceHealth: {
        healthy: 8,
        warning: 1,
        critical: 0,
        total: 9
      },
      latency: {
        avg: '1.2 ms',
        devToTest: '1.2 ms',
        testToProd: '1.4 ms',
        devToProd: 'Restricted'
      },
      packetLoss: '0.01%',
      availability: '99.98%',
      trafficMetrics: {
        throughput: '7.3 MB/s',
        inbound: '48.2 MB/s',
        outbound: '44.1 MB/s'
      }
    });
  },

  async getFlowLogs() {
    return Promise.resolve([
      {
        flowLogId: 'fl-0dev99881122',
        vpcName: 'Dev-VPC',
        resourceId: 'vpc-0dev1010001',
        trafficType: 'ALL',
        logDestinationType: 'cloud-watch-logs',
        status: 'ACTIVE'
      },
      {
        flowLogId: 'fl-0test99881122',
        vpcName: 'Test-VPC',
        resourceId: 'vpc-0test1020002',
        trafficType: 'ALL',
        logDestinationType: 'cloud-watch-logs',
        status: 'ACTIVE'
      },
      {
        flowLogId: 'fl-0prod99881122',
        vpcName: 'Prod-VPC',
        resourceId: 'vpc-0prod1030003',
        trafficType: 'REJECT',
        logDestinationType: 'cloud-watch-logs',
        status: 'ACTIVE'
      }
    ]);
  },
};

export const mockAiService = {
  async analyzeNetwork(question, context = {}) {
    const structured = getStructuredAiResponse(question);
    return Promise.resolve({
      query: question,
      ...structured,
      timestamp: new Date().toISOString(),
      confidence: 0.98,
    });
  },
};

export const mockAuditService = {
  async getAuditLogs() {
    return Promise.resolve([...MOCK_AUDIT_LOGS]);
  },
};

export const mockAuthService = {
  async login(username, password) {
    const isViewer = (username || '').toLowerCase().includes('viewer');
    const role = isViewer ? 'ROLE_VIEWER' : 'ROLE_ADMIN';
    const rawRole = isViewer ? 'VIEWER' : 'ADMIN';

    const userPayload = {
      username: username || 'admin',
      role,
      rawRole,
      tokenType: 'Bearer',
      expiresIn: 86400,
    };

    const mockToken = `mock-jwt-token-${rawRole.toLowerCase()}-${Date.now()}`;
    return Promise.resolve({
      token: mockToken,
      username: userPayload.username,
      role: userPayload.role,
      rawRole: userPayload.rawRole,
      tokenType: 'Bearer',
      expiresIn: 86400,
    });
  },

  getCurrentUser() {
    const raw = typeof window !== 'undefined' ? localStorage.getItem('cloudnexus_user') : null;
    try {
      if (raw) return JSON.parse(raw);
    } catch {
      // ignore
    }
    // Default demo admin user in mock mode
    return {
      username: 'admin',
      role: 'ROLE_ADMIN',
      rawRole: 'ADMIN',
      tokenType: 'Bearer',
      expiresIn: 86400,
    };
  },

  getToken() {
    const tok = typeof window !== 'undefined' ? localStorage.getItem('cloudnexus_token') : null;
    return tok || 'mock-demo-session-token';
  },

  isAuthenticated() {
    return true;
  },

  logout() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('cloudnexus_token');
      localStorage.removeItem('cloudnexus_user');
    }
  },
};

export default {
  mockDashboardService,
  mockVpcService,
  mockTransitGatewayService,
  mockRouteTableService,
  mockEc2Service,
  mockConnectivityService,
  mockSecurityService,
  mockMonitoringService,
  mockNetworkService,
  mockAiService,
  mockAuditService,
  mockAuthService,
};
