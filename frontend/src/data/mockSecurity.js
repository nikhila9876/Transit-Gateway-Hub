export const MOCK_SECURITY = {
  score: 86,
  status: "Needs Attention",
  summary: {
    critical: 1,
    warnings: 2,
    informational: 3
  },
  findings: [
    {
      id: "SEC-001",
      severity: "critical",
      title: "Dev to Prod Direct Traffic Policy",
      category: "Policy Enforcement",
      resourceId: "sg-0prod887766",
      resourceName: "Prod-App-SG",
      status: "Enforced",
      description: "Inbound traffic from DEV VPC (10.10.0.0/16) to PROD VPC on port 8080 is blocked by security group isolation rules.",
      evidence: "Prod-App-SG Inbound rule set permits TCP 8080 strictly from 10.20.0.0/16 (TEST VPC). Packets originating from 10.10.0.0/16 drop silently at the ENI boundary.",
      recommendation: "Maintain isolation; DEV should only communicate with TEST, and TEST with PROD."
    },
    {
      id: "SEC-002",
      severity: "warning",
      title: "Broad inbound rule detected",
      category: "Security Group Hygiene",
      resourceId: "sg-0dev887766",
      resourceName: "Dev-App-SG",
      status: "Review Required",
      description: "Development security group allows broad inbound HTTP ingress across learner subnet ranges.",
      evidence: "Security Group sg-0dev887766 has rule allowing 0.0.0.0/0 on port 8080 for testing purposes.",
      recommendation: "Review inbound access scope. Restrict ingress to internal CIDR blocks (10.10.0.0/16 and 10.20.0.0/16)."
    },
    {
      id: "SEC-003",
      severity: "warning",
      title: "Public Subnet Exposure Limitation",
      category: "Architecture",
      resourceId: "vpc-0prod1030003",
      resourceName: "Prod-VPC",
      status: "Review Required",
      description: "Workload servers currently reside in public subnets with IGW attachments for learner lab accessibility.",
      evidence: "Prod-App-Server (i-0prod123456789abcd) has public IP 52.90.87.64 bound to public subnet-0prod-pub.",
      recommendation: "Migrate backend database and processing workloads to private application subnets with NAT Gateways for production compliance."
    },
    {
      id: "SEC-004",
      severity: "informational",
      title: "SSH Port 22 Ingress Hardening",
      category: "Network Hygiene",
      resourceId: "sg-all",
      resourceName: "Dev/Test/Prod-SG",
      status: "Healthy",
      description: "Inbound TCP Port 22 is closed across all VPC security groups. Remote administration uses AWS Systems Manager Session Manager.",
      evidence: "Zero security groups have Port 22 exposed to 0.0.0.0/0 or RFC 1918 prefixes. IAM profile LabInstanceProfile is attached.",
      recommendation: "Ensure IAM least privilege policies are applied to Systems Manager access."
    },
    {
      id: "SEC-005",
      severity: "informational",
      title: "VPC Flow Logs & TGW Flow Logs Recommendation",
      category: "Observability",
      resourceId: "tgw-09e8712a34bc56df0",
      resourceName: "Enterprise-TGW",
      status: "Recommended",
      description: "Transit Gateway flow logs should be published to CloudWatch Log Groups for real-time threat intelligence and traffic analysis.",
      evidence: "TGW tgw-09e8712a34bc56df0 currently has flow logs inactive.",
      recommendation: "Enable TGW flow logging to Amazon S3 or CloudWatch Logs with Athena query integration."
    },
    {
      id: "SEC-006",
      severity: "informational",
      title: "IMDSv2 Enforcement Recommendation",
      category: "Compute Security",
      resourceId: "i-all",
      resourceName: "EC2 Fleet",
      status: "Compliant",
      description: "Instance Metadata Service Version 2 (IMDSv2) token session state is recommended across all EC2 nodes.",
      evidence: "HttpTokens parameter configured to optional on current developer lab AMIs.",
      recommendation: "Set HttpTokens=required in launch templates to prevent SSRF vulnerabilities."
    }
  ]
};

export const MOCK_SECURITY_FINDINGS = MOCK_SECURITY.findings;

export default MOCK_SECURITY;
