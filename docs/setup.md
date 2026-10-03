# AWS Setup Guide

This guide describes the learner-lab implementation for the Enterprise Multi-VPC Network Hub. It uses AWS Region `us-east-1` and the three non-overlapping VPCs documented in the [project README](../README.md).

## 1. Prerequisites

- An AWS account or an active AWS Academy Learner Lab session
- Permission to create VPC, EC2, IAM, Systems Manager, and Transit Gateway resources
- AWS Console access in `us-east-1`
- Three non-overlapping VPC CIDR ranges: `10.10.0.0/16`, `10.20.0.0/16`, and `10.30.0.0/16`
- An HTTP application that listens on TCP port `8080`

Do not place AWS credentials, access keys, API keys, or `.env` files in this repository.

## 2. AWS Account and Learner Lab

Start the learner lab before creating resources and confirm that the AWS Console is set to `us-east-1`. Learner Lab quotas and permissions can limit Transit Gateway, EC2, or IAM operations. Use the lab-provided IAM role or instance profile rather than creating long-lived credentials.

## 3. Create the VPCs

Create these VPCs with DNS support and DNS hostnames enabled:

| Name | CIDR |
| --- | --- |
| `Dev-VPC` | `10.10.0.0/16` |
| `Test-VPC` | `10.20.0.0/16` |
| `Prod-VPC` | `10.30.0.0/16` |

The ranges do not overlap, which is required for routing between VPCs through the Transit Gateway.

## 4. Create the Subnets

Create one public and one private application subnet in each VPC:

| VPC | Public subnet | Private application subnet |
| --- | --- | --- |
| DEV | `10.10.1.0/24` | `10.10.2.0/24` |
| TEST | `10.20.1.0/24` | `10.20.2.0/24` |
| PROD | `10.30.1.0/24` | `10.30.2.0/24` |

Use the public subnet for the current learner-lab application/testing path. Keep the private subnet available for internal workloads and future private-subnet deployment; the current lab does not claim that all EC2 instances are private.

## 5. Configure Internet Gateways

Create and attach one Internet Gateway to each VPC:

- `Dev-IGW` -> `Dev-VPC`
- `Test-IGW` -> `Test-VPC`
- `Prod-IGW` -> `Prod-VPC`

An Internet Gateway provides Internet connectivity when a subnet route table contains a default route to it. It does not provide the cross-VPC path; that path uses the Transit Gateway.

## 6. Configure Route Tables

Create or identify these public route tables and associate each with its public subnet:

- `Dev-Public-RT` for `Dev-VPC`
- `Test-Public-RT` for `Test-VPC`
- `Prod-Public-RT` for `Prod-VPC`

Each public route table has its automatic local VPC route and an Internet default route (`0.0.0.0/0`) to its VPC Internet Gateway.

After the Transit Gateway is attached, add the intended cross-VPC routes:

| VPC | Destination | Target |
| --- | --- | --- |
| DEV | `10.20.0.0/16`, `10.30.0.0/16` | `Enterprise-TGW` |
| TEST | `10.10.0.0/16`, `10.30.0.0/16` | `Enterprise-TGW` |
| PROD | `10.10.0.0/16`, `10.20.0.0/16` | `Enterprise-TGW` |

Verify the routes in the AWS Console after saving them. This guide describes intended configuration and does not prove that a route exists in a particular account.

## 7. Configure Security Groups

Create one application Security Group per environment: `Dev-App-SG`, `Test-App-SG`, and `Prod-App-SG`.

Allow TCP `8080` only from the source CIDR ranges required by the connectivity tests. The intended policy allows DEV -> TEST and TEST -> PROD, while the PROD policy restricts DEV -> PROD. Keep administrative access through Session Manager instead of opening SSH unnecessarily.

Security Groups are stateful, instance-level controls. They must be used with correct VPC routes, subnet configuration, network ACLs, and application listeners.

## 8. Prepare IAM and Session Manager

Attach the learner-lab instance profile `LabInstanceProfile` to each EC2 instance, where permitted by the lab. Confirm that the instance has the Systems Manager Agent and can reach the Systems Manager endpoints through its configured network path.

Use Systems Manager Session Manager for normal shell access. Do not document or commit credentials, private keys, or access tokens.

## 9. Deploy the EC2 Servers

Launch one application server per environment:

| Environment | Name | Security Group | Application response |
| --- | --- | --- | --- |
| DEV | `Dev-App-Server` | `Dev-App-SG` | `HELLO FROM DEV VPC` |
| TEST | `Test-App-Server` | `Test-App-SG` | `HELLO FROM TEST VPC` |
| PROD | `Prod-App-Server` | `Prod-App-SG` | `HELLO FROM PROD VPC` |

For the current lab, place the instances in the public application/testing path when following the implemented setup. Ensure the HTTP service listens on `0.0.0.0:8080` or the intended instance interface and returns the environment-specific response.

## 10. Create the Transit Gateway

Create a Transit Gateway named `Enterprise-TGW`. Use the default association and propagation behavior only if it matches the lab configuration you intend to operate; otherwise, configure the route table explicitly and record the actual settings.

## 11. Create VPC Attachments

Create one attachment from `Enterprise-TGW` to each VPC, selecting the appropriate subnets:

- `Dev-TGW-Attachment` -> `Dev-VPC`
- `Test-TGW-Attachment` -> `Test-VPC`
- `Prod-TGW-Attachment` -> `Prod-VPC`

Wait until all attachments are available. Record the actual attachment state in the AWS Console rather than assuming that creation completed successfully.

## 12. Configure the Transit Gateway Route Table

Use the Transit Gateway route table associated with the three VPC attachments. The intended routes are:

| Destination CIDR | Target attachment |
| --- | --- |
| `10.10.0.0/16` | `Dev-TGW-Attachment` |
| `10.20.0.0/16` | `Test-TGW-Attachment` |
| `10.30.0.0/16` | `Prod-TGW-Attachment` |

If route propagation is enabled, confirm the propagated routes and their attachment targets. Do not report a route as configured until it is visible in the route table.

## 13. Verify VPC Routes

Confirm that each VPC route table used by the application instances has routes to the other two VPC CIDR ranges through `Enterprise-TGW`. Confirm that the return path exists as well. A Transit Gateway route alone is insufficient if the VPC route table or Security Group blocks the response.

## 14. Deploy the HTTP Application

From a Session Manager shell on each server, start the simple HTTP application on port `8080` and verify locally:

```bash
curl http://localhost:8080
```

The expected response identifies the environment. Use the instance's private address for cross-VPC tests and keep the address as a placeholder in committed documentation.

## 15. Test Connectivity

From the DEV server:

```bash
curl http://<TEST_PRIVATE_IP>:8080
```

Expected response:

```text
HELLO FROM TEST VPC
```

From the TEST server:

```bash
curl http://<PROD_PRIVATE_IP>:8080
```

Expected response:

```text
HELLO FROM PROD VPC
```

From DEV to PROD, use the same request with `<PROD_PRIVATE_IP>`. It should be restricted according to `Prod-App-SG`. Do not replace placeholders with private IPs in this guide.

## 16. Troubleshooting

1. Confirm all resources are in `us-east-1` and that the VPC CIDRs do not overlap.
2. Confirm each attachment is available and associated with the intended Transit Gateway route table.
3. Confirm both forward and return VPC routes point to `Enterprise-TGW`.
4. Confirm the Security Group permits TCP `8080` from the source VPC CIDR and that the PROD rule intentionally blocks DEV where required.
5. Confirm the service is listening on port `8080` and the instance OS firewall allows it.
6. Confirm the Session Manager connection and Systems Manager Agent status.
7. Check subnet network ACLs, route propagation, and application logs before changing infrastructure.

## 17. Cleanup and Cost Considerations

When testing is complete, terminate the EC2 instances, delete VPC attachments, delete the Transit Gateway, remove route entries, delete subnets and Internet Gateways, and then delete the VPCs. Follow dependency order in the AWS Console so resources can be removed cleanly.

Transit Gateway, EC2, public IPv4 addresses, and related AWS services can incur charges depending on account and lab terms. Check the account billing view and learner-lab time remaining. Never delete resources belonging to another project or environment.

## 18. Planned Platform Integration

The intended CloudNexus platform architecture is React -> Spring Boot REST API -> AWS SDK -> AWS infrastructure. Network topology visualization, AWS management APIs, monitoring, audit logging, role-based access control, and AI-assisted diagnostics are future features unless their implementation is present in this repository. Any future AI assistant should analyze evidence and explain problems without automatically modifying production configuration.