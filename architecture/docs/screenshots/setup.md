# Setup and Configuration

## 1. Create VPCs

Three VPCs were configured:

- DEV: 10.0.0.0/16
- STAGE: 20.0.0.0/16
- PROD: 30.0.0.0/16

## 2. Create Transit Gateway

A Transit Gateway was created to provide centralized connectivity between the three VPCs.

## 3. Create VPC Attachments

The following VPCs were attached to the Transit Gateway:

- VPC-DEV
- VPC-STAGE
- VPC-PROD

All three attachments reached the Associated state.

## 4. Configure Transit Gateway Routes

The Transit Gateway route table contains:

- 10.0.0.0/16
- 20.0.0.0/16
- 30.0.0.0/16

The routes were propagated from the VPC attachments.

## 5. Configure VPC Route Tables

Each VPC route table contains routes to the other VPC CIDR blocks through the Transit Gateway.

## 6. Configure Security Groups

ICMP traffic was permitted between the three VPC CIDR ranges for connectivity testing.

## 7. Deploy EC2 Instances

One EC2 instance was deployed in each environment:

- EC2-DEV
- EC2-STAGE
- EC2-PROD

## 8. Test Connectivity

Connectivity was tested using ping between private IP addresses.

All tested connections returned:

4 packets transmitted, 4 received, 0% packet loss.