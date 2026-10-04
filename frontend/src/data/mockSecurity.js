/**
 * Realistic AWS Security Posture & Finding Records
 * Evaluated across DEV, TEST, and PROD VPCs and Enterprise-TGW
 * Categorized by: Critical, High, Medium, Low, Informational
 */

export const MOCK_SECURITY = {
  score: 88,
  status: "Needs Attention",
  summary: {
    critical: 1,
    high: 1,
    medium: 1,
    low: 1,
    informational: 2,
    total: 6,
  },
  resourceHealth: {
    healthy: 8,
    warning: 1,
    critical: 0,
    total: 9,
  },
  findings: [
    {
      id: "SEC-001",
      severity: "critical",
      title: "Dev to Prod Direct Traffic Isolation Policy",
      category: "Policy Enforcement",
      resourceId: "sg-0prod887766",
      resourceName: "Prod-App-SG",
      status: "Enforced",
      description: "Direct inbound HTTP traffic from DEV VPC (10.10.0.0/16) to PROD VPC on port 8080 is blocked by security group isolation rules.",
      evidence: "Prod-App-SG Inbound rule set permits TCP 8080 strictly from 10.20.0.0/16 (TEST VPC). Packets originating from 10.10.0.0/16 drop silently at the ENI boundary.",
      recommendation: "Maintain Zero-Trust isolation; DEV should only communicate with TEST, and TEST with PROD as defined by enterprise governance."
    },
    {
      id: "SEC-002",
      severity: "high",
      title: "Broad Inbound HTTP Ingress Scope",
      category: "Security Group Hygiene",
      resourceId: "sg-0dev887766",
      resourceName: "Dev-App-SG",
      status: "Review Required",
      description: "Development security group permits broad inbound HTTP ingress (0.0.0.0/0 on port 8080) for testing instead of restricting to internal CIDRs.",
      evidence: "Security Group sg-0dev887766 has rule: Type=Custom TCP, Port=8080, Source=0.0.0.0/0 bound to Dev-App-Server ENI.",
      recommendation: "Restrict inbound ingress to internal CIDR blocks (10.10.0.0/16 and 10.20.0.0/16) or trusted bastion CIDRs."
    },
    {
      id: "SEC-003",
      severity: "medium",
      title: "Workload Node Resides in Public Subnet",
      category: "Architecture & Network Segmentation",
      resourceId: "vpc-0prod1030003",
      resourceName: "Prod-VPC (Prod-App-Server)",
      status: "Review Required",
      description: "Production workload instance Prod-App-Server (i-0prod123456789abcd) has a public IPv4 address (52.90.87.64) bound to public subnet-0prod-pub.",
      evidence: "Prod-App-Server has public IP 52.90.87.64 with default route to Prod-IGW (igw-0prod9988).",
      recommendation: "Migrate production applications to private application subnets (subnet-0prod-priv: 10.30.2.0/24) with NAT Gateway egress."
    },
    {
      id: "SEC-004",
      severity: "low",
      title: "Transit Gateway Flow Logs Inactive",
      category: "Observability & Threat Detection",
      resourceId: "tgw-09e8712a34bc56df0",
      resourceName: "Enterprise-TGW",
      status: "Recommended",
      description: "Transit Gateway flow logs are not currently streamed to Amazon CloudWatch Logs or S3, limiting historical forensic visibility.",
      evidence: "TGW tgw-09e8712a34bc56df0 has 0 active flow log subscriptions.",
      recommendation: "Enable TGW flow logging to Amazon CloudWatch Logs or Amazon S3 with Amazon Athena integration for automated threat auditing."
    },
    {
      id: "SEC-005",
      severity: "informational",
      title: "SSH Port 22 Hardened via AWS Systems Manager",
      category: "Compute & Access Security",
      resourceId: "sg-all",
      resourceName: "Dev/Test/Prod Security Groups",
      status: "Healthy",
      description: "Inbound TCP Port 22 is closed across all VPC security groups. Administrative access is managed securely via AWS Systems Manager (SSM) Session Manager.",
      evidence: "Zero security groups have Port 22 exposed to 0.0.0.0/0 or RFC 1918 prefixes. IAM profile LabInstanceProfile is attached.",
      recommendation: "Ensure IAM least-privilege policies are periodically audited for SSM Session Manager operators."
    },
    {
      id: "SEC-006",
      severity: "informational",
      title: "IMDSv2 Session Token Configuration",
      category: "Compute Security",
      resourceId: "i-all",
      resourceName: "EC2 Fleet",
      status: "Compliant",
      description: "Instance Metadata Service Version 2 (IMDSv2) token session state is recommended across all EC2 nodes to mitigate SSRF risk.",
      evidence: "HttpTokens parameter configured across developer lab AMIs with hop limit 1.",
      recommendation: "Enforce HttpTokens=required in EC2 launch templates for new node scaling."
    }
  ]
};

export const MOCK_SECURITY_FINDINGS = MOCK_SECURITY.findings;

export default MOCK_SECURITY;
