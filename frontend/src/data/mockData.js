export const MOCK_VPCS = [
  {
    id: "vpc-0dev1010001",
    name: "DEV",
    displayName: "Dev-VPC",
    cidr: "10.10.0.0/16",
    region: "us-east-1",
    state: "available",
    subnetCount: 2,
    ec2Count: 1,
    attachmentStatus: "Attached",
    subnets: [
      { id: "subnet-0dev-pub", name: "Dev-Public-Subnet", cidr: "10.10.1.0/24", type: "Public", az: "us-east-1a" },
      { id: "subnet-0dev-priv", name: "Dev-Private-Subnet", cidr: "10.10.2.0/24", type: "Private", az: "us-east-1b" }
    ],
    routeTables: ["rtb-0dev-public"],
    igwId: "igw-0dev9988",
    securityGroup: "Dev-App-SG",
    color: "#3b82f6" // blue
  },
  {
    id: "vpc-0test1020002",
    name: "TEST",
    displayName: "Test-VPC",
    cidr: "10.20.0.0/16",
    region: "us-east-1",
    state: "available",
    subnetCount: 2,
    ec2Count: 1,
    attachmentStatus: "Attached",
    subnets: [
      { id: "subnet-0test-pub", name: "Test-Public-Subnet", cidr: "10.20.1.0/24", type: "Public", az: "us-east-1a" },
      { id: "subnet-0test-priv", name: "Test-Private-Subnet", cidr: "10.20.2.0/24", type: "Private", az: "us-east-1b" }
    ],
    routeTables: ["rtb-0test-public"],
    igwId: "igw-0test9988",
    securityGroup: "Test-App-SG",
    color: "#06b6d4" // cyan
  },
  {
    id: "vpc-0prod1030003",
    name: "PROD",
    displayName: "Prod-VPC",
    cidr: "10.30.0.0/16",
    region: "us-east-1",
    state: "available",
    subnetCount: 2,
    ec2Count: 1,
    attachmentStatus: "Attached",
    subnets: [
      { id: "subnet-0prod-pub", name: "Prod-Public-Subnet", cidr: "10.30.1.0/24", type: "Public", az: "us-east-1a" },
      { id: "subnet-0prod-priv", name: "Prod-Private-Subnet", cidr: "10.30.2.0/24", type: "Private", az: "us-east-1b" }
    ],
    routeTables: ["rtb-0prod-public"],
    igwId: "igw-0prod9988",
    securityGroup: "Prod-App-SG",
    color: "#6366f1" // indigo
  }
];

export const MOCK_TRANSIT_GATEWAY = {
  id: "tgw-09e8712a34bc56df0",
  name: "Enterprise-TGW",
  state: "Available",
  region: "us-east-1",
  asn: 64512,
  description: "Central Enterprise Transit Gateway Hub interconnecting DEV, TEST, and PROD VPCs",
  autoAcceptSharedAttachments: "enable",
  defaultRouteTableAssociation: "enable",
  defaultRouteTablePropagation: "enable",
  dnsSupport: "enable",
  vpnEcmpSupport: "enable",
  multicastSupport: "disable",
  attachments: [
    {
      id: "tgw-attach-0dev0123",
      name: "Dev-TGW-Attachment",
      vpcId: "vpc-0dev1010001",
      vpcName: "DEV",
      resourceType: "VPC",
      state: "available",
      associationState: "associated",
      subnetIds: ["subnet-0dev-pub"]
    },
    {
      id: "tgw-attach-0test0456",
      name: "Test-TGW-Attachment",
      vpcId: "vpc-0test1020002",
      vpcName: "TEST",
      resourceType: "VPC",
      state: "available",
      associationState: "associated",
      subnetIds: ["subnet-0test-pub"]
    },
    {
      id: "tgw-attach-0prod0789",
      name: "Prod-TGW-Attachment",
      vpcId: "vpc-0prod1030003",
      vpcName: "PROD",
      resourceType: "VPC",
      state: "available",
      associationState: "associated",
      subnetIds: ["subnet-0prod-pub"]
    }
  ],
  routes: [
    { destinationCidr: "10.10.0.0/16", targetAttachmentId: "tgw-attach-0dev0123", targetName: "Dev-TGW-Attachment", state: "active", type: "propagated" },
    { destinationCidr: "10.20.0.0/16", targetAttachmentId: "tgw-attach-0test0456", targetName: "Test-TGW-Attachment", state: "active", type: "propagated" },
    { destinationCidr: "10.30.0.0/16", targetAttachmentId: "tgw-attach-0prod0789", targetName: "Prod-TGW-Attachment", state: "active", type: "propagated" }
  ]
};

export const MOCK_ROUTE_TABLES = [
  {
    id: "rtb-0dev-public",
    name: "Dev-Public-RT",
    vpcId: "vpc-0dev1010001",
    vpcName: "DEV",
    routes: [
      { destination: "10.10.0.0/16", target: "local", status: "Active", propagated: "No" },
      { destination: "0.0.0.0/0", target: "igw-0dev9988 (Dev-IGW)", status: "Active", propagated: "No" },
      { destination: "10.20.0.0/16", target: "tgw-09e8712a34bc56df0 (Enterprise-TGW)", status: "Active", propagated: "No" },
      { destination: "10.30.0.0/16", target: "tgw-09e8712a34bc56df0 (Enterprise-TGW)", status: "Active", propagated: "No" }
    ],
    associations: ["subnet-0dev-pub", "subnet-0dev-priv"]
  },
  {
    id: "rtb-0test-public",
    name: "Test-Public-RT",
    vpcId: "vpc-0test1020002",
    vpcName: "TEST",
    routes: [
      { destination: "10.20.0.0/16", target: "local", status: "Active", propagated: "No" },
      { destination: "0.0.0.0/0", target: "igw-0test9988 (Test-IGW)", status: "Active", propagated: "No" },
      { destination: "10.10.0.0/16", target: "tgw-09e8712a34bc56df0 (Enterprise-TGW)", status: "Active", propagated: "No" },
      { destination: "10.30.0.0/16", target: "tgw-09e8712a34bc56df0 (Enterprise-TGW)", status: "Active", propagated: "No" }
    ],
    associations: ["subnet-0test-pub", "subnet-0test-priv"]
  },
  {
    id: "rtb-0prod-public",
    name: "Prod-Public-RT",
    vpcId: "vpc-0prod1030003",
    vpcName: "PROD",
    routes: [
      { destination: "10.30.0.0/16", target: "local", status: "Active", propagated: "No" },
      { destination: "0.0.0.0/0", target: "igw-0prod9988 (Prod-IGW)", status: "Active", propagated: "No" },
      { destination: "10.10.0.0/16", target: "tgw-09e8712a34bc56df0 (Enterprise-TGW)", status: "Active", propagated: "No" },
      { destination: "10.20.0.0/16", target: "tgw-09e8712a34bc56df0 (Enterprise-TGW)", status: "Active", propagated: "No" }
    ],
    associations: ["subnet-0prod-pub", "subnet-0prod-priv"]
  }
];

export const MOCK_EC2_INSTANCES = [
  {
    id: "i-0dev123456789abcd",
    name: "Dev-App-Server",
    environment: "DEV",
    vpcId: "vpc-0dev1010001",
    subnetId: "subnet-0dev-pub",
    privateIp: "10.10.1.45",
    publicIp: "34.200.12.80",
    instanceType: "t3.micro",
    state: "running",
    securityGroupId: "sg-0dev887766",
    securityGroupName: "Dev-App-SG",
    iamRole: "LabInstanceProfile",
    appPort: 8080,
    serviceResponse: "HELLO FROM DEV VPC",
    sessionManagerEnabled: true
  },
  {
    id: "i-0test123456789abcd",
    name: "Test-App-Server",
    environment: "TEST",
    vpcId: "vpc-0test1020002",
    subnetId: "subnet-0test-pub",
    privateIp: "10.20.1.88",
    publicIp: "54.210.45.19",
    instanceType: "t3.micro",
    state: "running",
    securityGroupId: "sg-0test887766",
    securityGroupName: "Test-App-SG",
    iamRole: "LabInstanceProfile",
    appPort: 8080,
    serviceResponse: "HELLO FROM TEST VPC",
    sessionManagerEnabled: true
  },
  {
    id: "i-0prod123456789abcd",
    name: "Prod-App-Server",
    environment: "PROD",
    vpcId: "vpc-0prod1030003",
    subnetId: "subnet-0prod-pub",
    privateIp: "10.30.1.112",
    publicIp: "52.90.87.64",
    instanceType: "t3.micro",
    state: "running",
    securityGroupId: "sg-0prod887766",
    securityGroupName: "Prod-App-SG",
    iamRole: "LabInstanceProfile",
    appPort: 8080,
    serviceResponse: "HELLO FROM PROD VPC",
    sessionManagerEnabled: true
  }
];

export const MOCK_SECURITY_FINDINGS = [
  {
    id: "SEC-001",
    title: "Dev to Prod Direct Traffic Policy",
    severity: "low",
    category: "Policy Enforcement",
    resourceId: "sg-0prod887766",
    resourceName: "Prod-App-SG",
    status: "Enforced",
    description: "Inbound traffic from DEV VPC (10.10.0.0/16) to PROD VPC on port 8080 is blocked by security group isolation rules.",
    recommendation: "Maintain isolation; DEV should only communicate with TEST, and TEST with PROD."
  },
  {
    id: "SEC-002",
    title: "SSH Port 22 Ingress Hardening",
    severity: "info",
    category: "Network Hygiene",
    resourceId: "sg-all",
    resourceName: "Dev/Test/Prod-SG",
    status: "Healthy",
    description: "Inbound TCP Port 22 is closed across all VPC security groups. Remote administration uses AWS Systems Manager Session Manager.",
    recommendation: "Ensure IAM least privilege policies are applied to Systems Manager access."
  },
  {
    id: "SEC-003",
    title: "Public Subnet Exposure Limitation",
    severity: "medium",
    category: "Architecture",
    resourceId: "vpc-0prod1030003",
    resourceName: "Prod-VPC",
    status: "Review",
    description: "Workload servers currently reside in public subnets with IGW attachments for learner lab accessibility.",
    recommendation: "Migrate backend database and processing workloads to private application subnets with NAT Gateways for production compliance."
  },
  {
    id: "SEC-004",
    title: "VPC Flow Logs & TGW Flow Logs Recommendation",
    severity: "medium",
    category: "Observability",
    resourceId: "tgw-09e8712a34bc56df0",
    resourceName: "Enterprise-TGW",
    status: "Recommended",
    description: "Transit Gateway flow logs should be published to CloudWatch Log Groups for real-time threat intelligence and traffic analysis.",
    recommendation: "Enable TGW flow logging to Amazon S3 or CloudWatch Logs with Athena query integration."
  }
];

export const MOCK_DASHBOARD_SUMMARY = {
  totalVpcs: 3,
  transitGatewayStatus: "Available",
  transitGatewayName: "Enterprise-TGW",
  tgwAttachments: 3,
  ec2Instances: 3,
  networkHealth: 94,
  securityFindings: 4,
  crossVpcConnectivity: "Optimal",
  activeAlerts: 1,
  totalSubnets: 6,
  region: "us-east-1",
  environmentBreakdown: [
    { name: "DEV", cidr: "10.10.0.0/16", status: "Healthy", instances: 1, color: "#3b82f6" },
    { name: "TEST", cidr: "10.20.0.0/16", status: "Healthy", instances: 1, color: "#06b6d4" },
    { name: "PROD", cidr: "10.30.0.0/16", status: "Healthy", instances: 1, color: "#6366f1" }
  ]
};

export const MOCK_METRICS = {
  latencyHistory: [
    { time: "18:00", devToTest: 1.2, testToProd: 1.4, devToProd: 0 },
    { time: "19:00", devToTest: 1.1, testToProd: 1.3, devToProd: 0 },
    { time: "20:00", devToTest: 1.3, testToProd: 1.5, devToProd: 0 },
    { time: "21:00", devToTest: 1.2, testToProd: 1.4, devToProd: 0 },
    { time: "22:00", devToTest: 1.4, testToProd: 1.6, devToProd: 0 },
    { time: "23:00", devToTest: 1.2, testToProd: 1.4, devToProd: 0 }
  ],
  throughput: [
    { time: "18:00", bytesIn: 45, bytesOut: 42 },
    { time: "19:00", bytesIn: 58, bytesOut: 53 },
    { time: "20:00", bytesIn: 72, bytesOut: 68 },
    { time: "21:00", bytesIn: 85, bytesOut: 80 },
    { time: "22:00", bytesIn: 64, bytesOut: 61 },
    { time: "23:00", bytesIn: 52, bytesOut: 49 }
  ],
  healthScore: 94
};

export const MOCK_AUDIT_LOGS = [
  {
    id: "aud-001",
    timestamp: "2026-10-03 22:45:10",
    actor: "admin@cloudnexus.io",
    action: "TRANSIT_GATEWAY_ROUTE_PROPAGATION_VERIFIED",
    resource: "Enterprise-TGW",
    status: "SUCCESS",
    details: "Verified route propagation for DEV (10.10.0.0/16), TEST (10.20.0.0/16), and PROD (10.30.0.0/16)."
  },
  {
    id: "aud-002",
    timestamp: "2026-10-03 21:12:04",
    actor: "system-scheduler",
    action: "CONNECTIVITY_SYNTHETIC_PROBE",
    resource: "Dev -> Test HTTP:8080",
    status: "SUCCESS",
    details: "Cross-VPC HTTP handshake latency: 1.2ms. Response 'HELLO FROM TEST VPC'."
  },
  {
    id: "aud-003",
    timestamp: "2026-10-03 20:30:19",
    actor: "admin@cloudnexus.io",
    action: "SECURITY_GROUP_RULE_AUDIT",
    resource: "Prod-App-SG",
    status: "SUCCESS",
    details: "Confirmed strict denial of DEV VPC traffic direct to PROD. Whitelisted TEST VPC (10.20.0.0/16:8080)."
  },
  {
    id: "aud-004",
    timestamp: "2026-10-03 19:15:42",
    actor: "session-manager",
    action: "SSM_SESSION_STARTED",
    resource: "i-0dev123456789abcd",
    status: "SUCCESS",
    details: "Engineer logged in via AWS SSM Session Manager for connectivity verification."
  }
];

export const MOCK_AI_RESPONSES = [
  {
    prompt: "DEV to PROD routing",
    response: "Traffic from DEV (10.10.0.0/16) destined for PROD (10.30.0.0/16) is routed through Enterprise-TGW according to Dev-Public-RT. However, Prod-App-SG restricts direct ingress on port 8080 from DEV CIDR, enforcing separation. Workloads flow DEV -> TEST -> PROD as required by policy."
  },
  {
    prompt: "Security posture assessment",
    response: "Overall posture is rated Strong (94/100). SSH port 22 is disabled across all nodes in favor of AWS Systems Manager Session Manager. TGW attachments are properly isolated. Key recommendation: Enable Transit Gateway flow logging to S3/CloudWatch."
  },
  {
    prompt: "Transit Gateway optimization",
    response: "Enterprise-TGW in us-east-1 is currently operating with 3 VPC attachments with ECMP enabled. Route tables have 0 blackhole routes. Latency between interconnected VPCs averages 1.2ms - 1.4ms."
  }
];
