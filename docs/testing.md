# CloudNexus Testing & Verification Guide

This document details the multi-tiered verification framework established for CloudNexus, encompassing unit testing, API integration testing, security policy evaluations, live AWS integration, and frontend build validations.

---

## 1. Test Architecture Overview

CloudNexus employs a dual-profile testing strategy:
1. **Mock Testing (`application-test.yml` / `profile: test`)**: Enables rapid, isolated unit and mock integration testing without requiring live AWS credentials or network egress.
2. **Live AWS Testing (`application.yml` / `profile: dev` or `default`)**: Validates real AWS SDK v2 calls against active AWS resources in `us-east-1` (or configured region) utilizing read-only IAM credentials.

---

## 2. Backend Automated Test Suite

The backend test suite is executed using Maven Surefire:

```powershell
# Windows
.\mvnw.cmd clean test

# Linux / macOS
./mvnw clean test
```

### Key Test Classes & Coverage

| Test Class | Focus & Verification Scope |
| :--- | :--- |
| **`CloudNexusApplicationTests`** | Spring application context bootstrapping and configuration validation. |
| **`AuthSecurityTests`** | JWT token generation, expiration enforcement, authentication failure handling, and method-level RBAC authorization rules. |
| **`RestApiIntegrationTests`** | Full mock MVC integration across all endpoints: `/api/dashboard`, `/api/vpcs`, `/api/transit-gateway`, `/api/security`, `/api/monitoring`, `/api/network/health`, `/api/network/flow-logs`, `/api/audit`, and public `/api/health`. Verifies `X-Correlation-ID` propagation and safe error payloads. |
| **`AwsConnectivityServiceTests`** | Evaluates deterministic route table and security group reachability rules (DEV -> TEST ALLOWED, DEV -> PROD RESTRICTED, etc.). |
| **`AwsDashboardServiceTests`** | Real-time metric compilation across VPCs, attachments, EC2 nodes, and health scores. |
| **`AwsEc2ServiceTests`** | EC2 instance inspection, state filtering, and handling of non-existent instances. |
| **`AwsMonitoringServiceTests`** | CloudWatch metric query aggregation, VPC-level traffic breakdown, and fallback baseline logic. |
| **`AwsNetworkFlowServiceTests`** | VPC Flow Logs discovery, capture window tracking, and rejection telemetry. |
| **`AwsSecurityAnalysisServiceTests`** | Evaluation of real security group ingress rules, 0.0.0.0/0 exposure checks, port 22/3389 risks, and severity classification. |
| **`AwsTransitGatewayServiceTests`** | Transit Gateway metadata inspection, attachment state checks, and route propagation. |
| **`AwsVpcServiceTests`** | VPC CIDR discovery, subnet association, and CIDR overlap detection. |
| **`EvidenceBasedAiServiceTests`** | Grounded AI reasoning engine verification: ensures questions regarding isolation, security, or reachability cite concrete discovered evidence. |
| **`InMemoryAuditServiceTests`** | Thread-safe audit store verification: startup seeding, newest-first ordering, capacity bounds (200 records), and event publishing. |

---

## 3. Frontend Production Build & Bundle Verification

The frontend is verified via Vite build compilation and linting:

```bash
cd frontend
npm run build
```

- **Output Validation**: Ensures all 2,400+ modules transform cleanly into the production `dist/` directory (`index.html`, minified JavaScript chunks, CSS assets).
- **Zero Credentials Check**: Confirms no AWS SDK libraries, secrets, or API keys are bundled into client-side scripts.

---

## 4. Connectivity Diagnostics Verification

CloudNexus evaluates network connectivity using two complementary mechanisms:
1. **Rule-Based Engine Analysis**: Evaluates VPC route table targets (`TransitGatewayId`), Transit Gateway route tables, and destination Security Group ingress rules (e.g., verifying TCP port 8080 between source CIDR and target security group).
2. **SSM Private Execution Verification**:
   - In production environments with AWS Systems Manager enabled, automated diagnostics verify ICMP ping or HTTP port probe reachability between EC2 private IP addresses via `AWS-RunShellScript`.
   - In environments where SSM or instances are offline, CloudNexus transparently reports evaluated status based on deterministic AWS policy inspection without fabricating latency numbers.

---

## 5. Security Intelligence Verification

The security analyzer scans live security group rules across all VPCs for enterprise compliance:
- **Rule 1: Broad SSH Exposure**: Ingress rules opening TCP port 22 to `0.0.0.0/0`.
- **Rule 2: Broad RDP Exposure**: Ingress rules opening TCP port 3389 to `0.0.0.0/0`.
- **Rule 3: Unrestricted All-Traffic Ingress**: Ingress rules permitting `-1` protocol from `0.0.0.0/0`.
- **Rule 4: Multi-VPC Unrestricted Routing**: Route table entries directing non-local traffic through an unmanaged Internet Gateway instead of the central Transit Gateway.

---

## 6. Observability & Health Verification

The public health endpoint is tested without credentials:

```bash
curl -i http://localhost:8080/api/health
```

Expected Response:
```json
{
  "application": "UP",
  "aws": "AVAILABLE",
  "timestamp": "2026-10-04T01:19:15.345Z"
}
```

If AWS credentials are temporarily missing or invalid:
```json
{
  "application": "UP",
  "aws": "UNAVAILABLE",
  "timestamp": "2026-10-04T01:19:15.345Z"
}
```
*(HTTP status remains 200 OK to prevent cascading probe failures).*
