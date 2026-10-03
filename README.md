# 🚀 Transit Gateway Hub for Three VPC Environments

## 📌 Project Overview

This project implements a centralized **AWS Transit Gateway Hub** to provide private network connectivity between three isolated VPC environments:

- **DEV**
- **STAGE**
- **PROD**

The Transit Gateway acts as a central networking hub, allowing the three VPCs to communicate without requiring direct VPC peering connections.

---

## 🎯 Project Objectives

- Create three independent AWS VPC environments.
- Connect the VPCs using a centralized AWS Transit Gateway.
- Configure VPC attachments for DEV, STAGE, and PROD.
- Configure Transit Gateway route propagation.
- Configure VPC route tables for inter-VPC communication.
- Deploy EC2 instances for connectivity testing.
- Verify connectivity using ICMP ping.
- Document and maintain the project using Git and GitHub.

---

## 🏗️ Architecture

```text
                  ┌─────────────────────┐
                  │   AWS Transit       │
                  │      Gateway        │
                  │     TGW Hub         │
                  └──────────┬──────────┘
                             │
             ┌───────────────┼───────────────┐
             │               │               │
             ▼               ▼               ▼
      ┌────────────┐  ┌────────────┐  ┌────────────┐
      │ DEV VPC    │  │ STAGE VPC  │  │ PROD VPC   │
      │ 10.0.0.0/16│  │20.0.0.0/16 │  │30.0.0.0/16 │
      └─────┬──────┘  └─────┬──────┘  └─────┬──────┘
            │                │                │
            ▼                ▼                ▼
       EC2-DEV          EC2-STAGE         EC2-PROD
       10.0.1.77        20.0.1.187        30.0.1.235