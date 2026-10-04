# CloudNexus Deployment & Operations Guide

This guide describes how to deploy, configure, and operate CloudNexus across development, testing, and production environments.

---

## 1. System Requirements & Architecture Overview

CloudNexus consists of two main deployable services:
1. **Frontend**: React 18 + Vite SPA served via any static web server (NGINX, AWS S3 + CloudFront, or Node).
2. **Backend**: Spring Boot 3 (Java 17+) REST API acting as the secure AWS integration broker.

```mermaid
flowchart LR
    Client[Web Browser] -->|HTTPS| Frontend[CloudNexus UI / React]
    Frontend -->|REST + JWT| Backend[CloudNexus API / Spring Boot]
    Backend -->|AWS SDK v2 (Read-Only)| AWS[(AWS Cloud Services)]
```

---

## 2. Configuration & Environment Variables

All runtime settings are driven via environment variables or Spring application properties.

### Backend Environment Configuration

| Variable | Description | Default | Production Value |
| :--- | :--- | :--- | :--- |
| `SERVER_PORT` | HTTP port for Spring Boot API | `8080` | `8080` |
| `AWS_REGION` | Target AWS region containing Transit Gateway | `us-east-1` | `us-east-1` |
| `CLOUDNEXUS_DATA_SOURCE` | Service implementation mode (`aws` or `mock`) | `aws` | `aws` |
| `JWT_SECRET` | 256-bit cryptographic signing secret for JWTs | *(default dev secret)* | *(Strong random 32+ char secret)* |
| `JWT_EXPIRATION_MS` | JWT validity window in milliseconds | `86400000` (24h) | `86400000` |
| `AWS_ACCESS_KEY_ID` | Standard AWS IAM access key (if not using IAM role) | *(Optional)* | *(Injected via Secret Manager)* |
| `AWS_SECRET_ACCESS_KEY` | Standard AWS IAM secret key | *(Optional)* | *(Injected via Secret Manager)* |
| `AWS_SESSION_TOKEN` | Session token for temporary credentials / Learner Lab | *(Optional)* | *(Injected dynamically)* |

### Frontend Environment Configuration

| Variable | Description | Default |
| :--- | :--- | :--- |
| `VITE_API_BASE_URL` | Base URL of the Spring Boot backend API | `/api` (proxied in dev to `http://localhost:8080`) |

---

## 3. Local Development Deployment

### Prerequisites
- Java Development Kit (JDK) 17 or higher
- Node.js 18+ and npm
- AWS CLI configured or valid temporary Learner Lab credentials

### Step 1: Start Backend

```powershell
# In backend directory
cd backend

# Configure AWS temporary credentials in shell if testing in AWS mode
$env:AWS_REGION="us-east-1"
$env:AWS_ACCESS_KEY_ID="<your-access-key-id>"
$env:AWS_SECRET_ACCESS_KEY="<your-secret-access-key>"
$env:AWS_SESSION_TOKEN="<your-session-token>"

# Run backend application
.\mvnw.cmd spring-boot:run
```
*(Backend starts on `http://localhost:8080`)*

### Step 2: Start Frontend

```bash
# In frontend directory
cd frontend

# Install dependencies (first time only)
npm install

# Start Vite dev server
npm run dev
```
*(Frontend starts on `http://localhost:5173` with automatic API proxy to `http://localhost:8080`)*

---

## 4. Production Deployment Considerations

### 1. IAM Instance Profile & ECS/EKS Roles
In AWS production deployments (Amazon EC2, ECS, or EKS), avoid hardcoded access keys. Assign an **IAM Instance Profile** or **ECS Task Execution Role** directly to the hosting computing resource with read-only permissions for EC2, Transit Gateway, Route Tables, and CloudWatch.

### 2. Reverse Proxy & SSL Termination
Deploy an Application Load Balancer (ALB) or NGINX reverse proxy in front of CloudNexus:
- Terminate SSL/TLS (HTTPS on port 443).
- Route `/api/*` to the Spring Boot backend instances.
- Route `/*` to static React build assets or an S3 bucket.

### 3. Containerization
Both components can be built into standard Docker containers:
- **Backend**: Multi-stage Dockerfile packaging `amazoncorretto:17-alpine-jdk` or `eclipse-temurin:21-jre-alpine`.
- **Frontend**: NGINX Alpine container hosting the output of `npm run build`.

---

## 5. AWS Learner Lab Limitations & Nuances

When operating within an **AWS Learner Lab** or restricted sandbox:
- **Role Limitations**: The `LabRole` or `LabInstanceProfile` provides pre-assigned permissions that cannot be modified.
- **VPC Flow Logs**: May require S3 or CloudWatch Log Group permissions that are restricted in some learner environments. CloudNexus gracefully detects this and displays fallback flow telemetry.
- **Temporary Session Tokens**: Learner Lab credentials rotate frequently (usually valid for 4 hours). Update `AWS_SESSION_TOKEN` whenever the lab resets.
- **SSM Session Manager**: Ensure target EC2 instances have the SSM Agent running and are associated with the `LabInstanceProfile` for live SSM diagnostics.
