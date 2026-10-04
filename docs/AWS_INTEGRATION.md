# CloudNexus AWS SDK Integration & Architecture

This document details the real AWS SDK for Java v2 integration, interface-driven dual-mode architecture, and IAM least-privilege security model in CloudNexus.

---

## 1. System Architecture

CloudNexus strictly enforces separation of concerns:
- **React Frontend**: Connects exclusively to the Spring Boot REST API (`/api/*`). The frontend never interacts directly with AWS APIs and never holds AWS credentials.
- **Spring Boot Backend**: Serves as the central management plane. Uses AWS SDK for Java v2 to discover, monitor, and query AWS infrastructure.
- **Service Layer Abstraction**: Provides clean interface boundaries (`VpcService`, `TransitGatewayService`, `RouteTableService`, `Ec2Service`, `MonitoringService`, `DashboardService`) with dual implementations (`Aws*` and `Mock*`).

```
React (Frontend)
   │ (HTTPS / Bearer JWT)
   ▼
Spring Boot REST API Controllers
   │
   ▼
Service Interfaces
   ├── [cloudnexus.data-source=aws]  ──▶  AWS SDK v2 Services ──▶ AWS Cloud (Learner Lab)
   └── [cloudnexus.data-source=mock] ──▶  Mock In-Memory Services (CI/Testing)
```

---

## 2. Dual-Mode Runtime Switching

The data source mode is configured dynamically without recompilation:

```yaml
# application.yml
cloudnexus:
  data-source: ${CLOUDNEXUS_DATA_SOURCE:aws} # Defaults to 'aws' in production
```

- **Production / Live AWS Mode (`aws`)**:
  - Automatically activated when `CLOUDNEXUS_DATA_SOURCE=aws` or left at default.
  - Activates beans annotated with `@ConditionalOnProperty(name = "cloudnexus.data-source", havingValue = "aws", matchIfMissing = true)`.
  - Connects to AWS via `DefaultCredentialsProvider.create()` using Learner Lab credentials, environment variables, or IAM role.
- **Mock Mode (`mock`)**:
  - Activated when `CLOUDNEXUS_DATA_SOURCE=mock` or during unit/integration tests (`application-test.yml`).
  - Activates beans annotated with `@ConditionalOnProperty(name = "cloudnexus.data-source", havingValue = "mock")`.
  - Guarantees 100% deterministic test execution without requiring network access or AWS credentials.

---

## 3. AWS SDK for Java v2 Details

- **BOM Version**: `software.amazon.awssdk:bom:2.25.70`
- **Dependencies**:
  - `software.amazon.awssdk:ec2` (VPC, Subnet, TGW, Route Tables, EC2 discovery)
  - `software.amazon.awssdk:cloudwatch` (CPU utilization telemetry)
  - `software.amazon.awssdk:sts` (Safe connection verification & caller identity check)
- **Credential Provider**: `DefaultCredentialsProvider.create()`
  1. Environment variables (`AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_SESSION_TOKEN`)
  2. Java system properties
  3. Web identity token credentials
  4. Credential profiles file (`~/.aws/credentials`)
  5. Container credentials (ECS / EKS)
  6. Amazon EC2 instance profile / AWS Learner Lab `LabRole`
- **Region Management**:
  - Resolved via `cloudnexus.aws.region` (defaults to `us-east-1`), configurable via `AWS_REGION`.

---

## 4. AWS Discovery & Batching Implementations

To respect strict AWS Learner Lab API limits and prevent N+1 query storms:
- **VPC & Subnet Discovery (`AwsVpcService`)**:
  - `DescribeVpcs` queries active VPCs.
  - Subnets and security groups are queried in batch and mapped to parent VPCs in-memory.
- **Transit Gateway Discovery (`AwsTransitGatewayService`)**:
  - `DescribeTransitGateways` identifies the central hub.
  - `DescribeTransitGatewayAttachments` maps VPC-to-TGW associations.
  - `DescribeTransitGatewayRouteTables` & `SearchTransitGatewayRoutes` discover active routing prefixes.
- **EC2 Resource Discovery (`AwsEc2Service`)**:
  - `DescribeInstances` queries instance states, private/public IPs, and subnet associations in a single pass.
- **CloudWatch Telemetry (`AwsMonitoringService`)**:
  - Queries `CPUUtilization` over the last 1 hour with a 60-second in-memory cache to prevent redundant API queries.
- **Dashboard Summary (`AwsDashboardService`)**:
  - Computes platform-wide metrics and calculates the **CloudNexus Network Health** score (0-100) based on actual resource state.

---

## 5. Security & IAM Least Privilege Specification

CloudNexus is strictly a **READ-ONLY** platform at this stage. It does not perform any infrastructure mutation (no creation, deletion, or modification of VPCs, TGWs, routes, or EC2 instances).

### Required Read-Only IAM Permissions:
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "CloudNexusReadOnlyDiscovery",
      "Effect": "Allow",
      "Action": [
        "ec2:DescribeVpcs",
        "ec2:DescribeSubnets",
        "ec2:DescribeTransitGateways",
        "ec2:DescribeTransitGatewayAttachments",
        "ec2:DescribeTransitGatewayRouteTables",
        "ec2:SearchTransitGatewayRoutes",
        "ec2:DescribeRouteTables",
        "ec2:DescribeInstances",
        "ec2:DescribeSecurityGroups",
        "ec2:DescribeInternetGateways",
        "cloudwatch:GetMetricStatistics",
        "cloudwatch:ListMetrics",
        "sts:GetCallerIdentity"
      ],
      "Resource": "*"
    }
  ]
}
```

> **Learner Lab Sandbox Compatibility**: When running in the AWS Learner Lab, CloudNexus automatically leverages the pre-configured `LabRole` or session credentials provided by the Learner Lab console without modifying IAM policies or requiring `AdministratorAccess`.
