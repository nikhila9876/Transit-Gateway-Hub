# Transit Gateway Hub for Three VPC Environments

## Project Overview

This project implements a centralized AWS Transit Gateway Hub connecting three isolated VPC environments:

- DEV
- STAGE
- PROD

The Transit Gateway provides private network connectivity between the three VPCs without requiring VPC peering connections.

## Architecture

Three VPCs are connected through a central AWS Transit Gateway.

### VPC Networks

| Environment | CIDR |
|-------------|------|
| DEV | 10.0.0.0/16 |
| STAGE | 20.0.0.0/16 |
| PROD | 30.0.0.0/16 |

## EC2 Test Instances

| Environment | Private IP |
|-------------|------------|
| DEV | 10.0.1.77 |
| STAGE | 20.0.1.187 |
| PROD | 30.0.1.235 |

## Transit Gateway

Transit Gateway ID:

`tgw-02169b6d98c63a137`

The Transit Gateway has three VPC attachments.

## Connectivity Testing

Connectivity was verified using ICMP ping between the EC2 instances.

Example:

```bash
ping -c 4 20.0.1.187