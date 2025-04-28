# 🚀 Microservice Application Example - DevOps Guide

Welcome to the documentation for the *Microservices Project* deployed on *Azure Container Apps* using *Azure DevOps Pipelines* for CI/CD! This guide covers the architecture, DevOps workflow, infrastructure setup, and local development instructions.

---

## 📦 Project Repositories

- *Application Code:* [microservice-app-example](https://github.com/darwinl-06/microservice-app-example)
- *Infrastructure as Code:* [microservice-infrastructure](https://github.com/darwinl-06/microservice-infrastructure)

---

## 🏩 Architecture Overview

![Microservices Architecture Diagram](arch-img/Microservices.png)

### Microservices:

| Service | Technology | Purpose |
|---------|------------|---------|
| Frontend | Vue.js + Nginx | User Interface |
| Auth API | Go | User Authentication |
| Users API | Java Spring Boot | User Management |
| Todos API | Node.js Express | Task Management |
| Log Message Processor | Python | Log Processing |

### External Services:

- Redis: Caching and session management.

---

## 🏗 Infrastructure Overview

Infrastructure is provisioned using *Terraform*.

### Azure Resources:


🖌 Azure Container Apps
🖌 Azure Container Registry (ACR)
🖌 Azure Redis Cache
🖌 Azure Log Analytics
🖌 Azure Key Vault


### Infrastructure as Code Highlights:

- Resource, Network, and Security definitions.
- Secret management via Azure Key Vault.
- Service Connections for CI/CD pipelines.

---

## 🔄 DevOps Workflow (CI/CD)

Automation of build, testing, and deployment on code changes!

### 🚀 Prerequisites

- Azure DevOps project
- Active Azure Subscription
- Azure Container Registry (ACR)
- Service Connections:
  - ACR-Service-Connection
  - Azure-Resource-Manager-Connection
- Variable Groups:
  - app-variables-dev
  - app-variables-prod

🔑 Required Secrets:
- acrName
- redisHostName
- redisPrimaryKey
- jwtSecretValue
- dbConnectionString

---

### 🛠 Pipeline Structure

*Stage 1: BuildAndPush*
- Triggered on changes to dev or master
- Matrix strategy for parallel builds
- Git diff to detect changed services
- Conditional build and push to ACR

*Stage 2: DeployToContainerApps*
- Depends on BuildAndPush
- Branch-driven deployments
- Steps:
  1. Pull images from ACR
  2. Update app configurations
  3. Deploy modified microservices
  4. Update environment variables and secrets
  5. Validate deployment

---

### 🌎 Environments

| Environment | Branch | Variable Group | Approval Required |
|-------------|--------|----------------|-------------------|
| Development | dev | app-variables-dev | No |
| Production | master | app-variables-prod | Yes (Manual Gate) |

---

## 💻 Running the Project Locally

1. Clone the repo:
   bash
   git clone https://github.com/darwinl-06/microservice-app-example.git
   
2. Install Docker and Docker Compose.
3. Start the services:
   bash
   docker-compose up
   
4. Open [http://localhost:8080](http://localhost:8080)

---

## 🌐 Infrastructure Provisioning

1. Clone the infrastructure repo:
   bash
   git clone https://github.com/darwinl-06/microservice-infrastructure.git
   
2. Install Terraform CLI.
3. Navigate to the corresponding environment (dev or prod).
4. Run:
   bash
   terraform init
   terraform plan
   terraform apply
   

---

## 💡 Key Concepts and Best Practices

- *IaC First:* Use Terraform exclusively.
- *GitOps:* Git as the single source of truth.
- *Environment Separation:* Branches and variable groups.
- *Efficient CI/CD:* Deploy only what has changed.
- *Secrets Management:* Azure Key Vault integration.
- *Polyglot Architecture:* Best technology per service.

---

## 🤝 Contributing

1. Branch from dev
2. Make your changes and commit.
3. Create a Pull Request into dev
4. After successful tests, merge into master

