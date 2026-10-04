# CloudNexus Security Architecture & Threat Model

This document outlines the security architecture, authentication standards, credential segregation, and data protection mechanisms enforced across the CloudNexus platform.

---

## 1. Authentication & Session Security (JWT)

CloudNexus implements stateless, token-based authentication using **JSON Web Tokens (JWT)** signed via **HMAC-SHA256**.

- **Stateless Verification**: The backend verifies token signatures on every inbound HTTP request via `JwtAuthenticationFilter` prior to routing to Spring Security authorization checks.
- **Claim Integrity**: Claims contain subject (`username`), assigned role (`ROLE_ADMIN` or `ROLE_VIEWER`), issued timestamp, and an expiration timestamp (configured via `jwt.expiration-ms=86400000`).
- **No Sensitive Payload**: Passwords, AWS secret keys, session tokens, or internal infrastructure tokens are never stored or transferred within JWT claims.
- **Header Structure**: Transmitted via standard RFC 6750 Authorization header:
  ```http
  Authorization: Bearer <signed-jwt-token>
  ```

---

## 2. Role-Based Access Control (RBAC)

CloudNexus defines distinct persona roles enforced at both the API gateway and method levels via Spring Security's `@EnableMethodSecurity`:

| Role | Permissions & Operational Scope |
| :--- | :--- |
| **`ROLE_ADMIN`** | Full visibility into multi-VPC topology, route tables, and instances. Permitted to execute cross-VPC network reachability diagnostics, run AI troubleshooting queries, inspect security audit findings, and view compliance event logs. |
| **`ROLE_VIEWER`** | Read-only access to infrastructure topology, metrics dashboards, health telemetry, and flow logs. Unauthorized to trigger diagnostics or configuration mutations. |

Unauthenticated access is restricted strictly to:
- `POST /api/auth/login` (Authentication endpoint)
- `GET /api/health` (Observability and liveness probe)
- Static client application assets and `/error` handler

---

## 3. Read-Only AWS Architecture

A foundational architectural constraint of CloudNexus is **strict read-only inspection**:
- The platform never modifies, mutates, creates, or deletes AWS resources.
- All AWS SDK v2 client calls utilize `Describe*`, `Get*`, and `List*` operations exclusively (e.g., `DescribeVpcs`, `DescribeTransitGateways`, `DescribeTransitGatewayAttachments`, `DescribeRouteTables`, `DescribeSecurityGroups`, `DescribeInstances`, `GetMetricData`).
- Even in diagnostic modes, CloudNexus does not inject synthetic traffic or mutate routing rules in live accounts.

---

## 4. AWS Credential Segregation & Least Privilege

CloudNexus strictly enforces separation between the presentation layer, the application layer, and cloud credentials:

1. **Zero Frontend Credentials**:
   - The React frontend holds **zero AWS credentials**.
   - React communicates exclusively with the Spring Boot integration layer over HTTPS with JWT bearer tokens.
   - React bundle source code is audited to guarantee zero references to `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, or `AWS_SESSION_TOKEN`.
2. **AWS SDK Default Credentials Chain**:
   - The backend uses `software.amazon.awssdk.auth.credentials.DefaultCredentialsProvider`.
   - Credentials are dynamically sourced through the standard AWS precedence hierarchy:
     1. Environment Variables (`AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_SESSION_TOKEN`)
     2. Java System Properties
     3. Web Identity Token credentials
     4. Shared Credentials file (`~/.aws/credentials`) and config (`~/.aws/config`)
     5. Amazon EC2 / ECS / EKS Instance Metadata Service (IMDSv2)
3. **IAM Least-Privilege Policy**:
   - The execution role requires read-only permissions:
     ```json
     {
       "Version": "2012-10-17",
       "Statement": [
         {
           "Effect": "Allow",
           "Action": [
             "ec2:DescribeVpcs",
             "ec2:DescribeSubnets",
             "ec2:DescribeRouteTables",
             "ec2:DescribeTransitGateways",
             "ec2:DescribeTransitGatewayAttachments",
             "ec2:DescribeTransitGatewayRouteTables",
             "ec2:DescribeTransitGatewayRoutes",
             "ec2:DescribeInstances",
             "ec2:DescribeSecurityGroups",
             "ec2:DescribeFlowLogs",
             "cloudwatch:GetMetricData",
             "sts:GetCallerIdentity"
           ],
           "Resource": "*"
         }
       ]
     }
     ```

---

## 5. Secret Management & Zero-Secrets Compliance

- **No Secrets in Version Control**: Source control repositories are actively scanned against patterns matching `AKIA*`, `AWS_SECRET_ACCESS_KEY`, private keys, and passwords.
- **Environment Ingestion**: Sensitive parameters (`JWT_SECRET`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_SESSION_TOKEN`) are injected exclusively via container environment variables or external secret stores (e.g., AWS Secrets Manager, HashiCorp Vault) at runtime.
- **Masking in Logs**: SLF4J loggers format operational events while ensuring that authorization tokens, passwords, and AWS credentials are never written to disk or stdout.

---

## 6. Audit Logging & Non-Repudiation

CloudNexus captures an immutable, in-memory compliance audit trail (`InMemoryAuditService`) documenting:
- User identity (e.g., `admin@cloudnexus.io`)
- User role
- Target action (`Login`, `Network Test`, `AI Analysis`, `Security Audit`, `Topology Discovery`)
- Target resource identifier (e.g., `Dev-VPC -> Test-VPC`, `sg-0abc1234def56789a`)
- Execution status (`SUCCESS`, `WARNING`, `CRITICAL`)
- Detailed context and timestamp

All logs are accessible through `GET /api/audit` with multi-dimensional filtering (action, user, status, keyword search).

---

## 7. Distributed Request Tracing & Correlation IDs

Every inbound HTTP transaction is tagged with a unique **Correlation ID** (`X-Correlation-ID`) via `CorrelationIdFilter`:
- Injected into SLF4J Mapped Diagnostic Context (MDC) for cross-service log tracing.
- Preserved and returned in HTTP response headers.
- Included in all error responses produced by `GlobalExceptionHandler` to enable safe error reporting without exposing internal stack traces or database schema details to clients.
