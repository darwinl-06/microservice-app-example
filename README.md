# 🚀 Microservice Application Example

This repository contains a multi-service application built using a microservices architecture. The application is designed to demonstrate modern DevOps practices, containerization, and cloud-native development with Azure Container Apps.

![Microservices Architecture Diagram](arch-img/Microservices.png)

## Table of Contents

- [Architecture Overview](#architecture-overview)
- [Microservices Description](#microservices-description)
- [Dockerfile Implementation](#dockerfile-implementation)
- [CI/CD Pipeline with Azure DevOps](#cicd-pipeline-with-azure-devops)
- [Azure Infrastructure](#azure-infrastructure)
- [Local Development](#local-development)
- [Security Considerations](#security-considerations)
- [Contributing](#contributing)
- [License](#license)

## Architecture Overview

The application implements a Todo application with user authentication, employing a microservices architecture with the following components:

- **Frontend**: Vue.js application served via Nginx
- **Auth API**: Authentication service built with Go
- **Users API**: User management service built with Java Spring Boot
- **Todos API**: Todo item management service built with Node.js Express
- **Log Message Processor**: Centralized logging service built with Python
- **External Services**: Redis for caching and session management

The services communicate with each other via RESTful APIs and message passing through Redis.

## Microservices Description

### Frontend (Vue.js + Nginx)
- **Purpose**: Provides the user interface for the application
- **Technology**: Vue.js with Nginx as the web server
- **Functionality**: Offers user login, registration, and todo management interface
- **Dependencies**: Communicates with Auth API, Users API, and Todos API

### Auth API (Go)
- **Purpose**: Handles user authentication and JWT token generation
- **Technology**: Go language (Golang)
- **Functionality**: Validates user credentials, issues JWT tokens, and verifies token validity
- **Dependencies**: Communicates with Users API to validate user information

### Users API (Java Spring Boot)
- **Purpose**: Manages user account information and profiles
- **Technology**: Java Spring Boot with JPA/Hibernate
- **Functionality**: User registration, profile management, and account verification
- **Dependencies**: Uses a database for persistent storage of user data

### Todos API (Node.js Express)
- **Purpose**: Handles todo item management
- **Technology**: Node.js with Express framework
- **Functionality**: Creation, reading, updating, and deletion of todo items
- **Dependencies**: Requires Redis for caching and temporary storage, uses JWT tokens for authentication

### Log Message Processor (Python)
- **Purpose**: Centralized service for processing and storing log messages
- **Technology**: Python
- **Functionality**: Collects logs from all services, processes them, and stores for later analysis
- **Dependencies**: Listens to Redis channels for log messages

## Dockerfile Implementation

All services are containerized using Docker with optimized multi-stage builds where appropriate. Below are the key implementation details for each service's Dockerfile:

### Auth API Dockerfile
```dockerfile
# Multi-stage build for optimized container size
FROM golang:1.18-alpine AS builder
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o auth-api .

# Final lightweight image
FROM alpine:3.16
RUN apk --no-cache add ca-certificates
WORKDIR /root/
COPY --from=builder /app/auth-api .
EXPOSE 8000
ENV AUTH_API_PORT=8000
ENV USERS_API_ADDRESS=http://users-api:8080
ENV JWT_SECRET=PRFT
CMD ["./auth-api"]
```
**Key features**:
- Uses multi-stage build pattern to minimize final image size
- Includes only necessary CA certificates for secure communications
- Configurable via environment variables
- Distroless final image for reduced attack surface

### Users API Dockerfile
This Java service uses Maven for building and packaging:
```
FROM maven:3.8-openjdk-11 AS build
COPY . /app
WORKDIR /app
RUN mvn clean package -DskipTests

FROM openjdk:11-jre-slim
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENV SPRING_PROFILES_ACTIVE=prod
CMD ["java", "-jar", "app.jar"]
```
**Key features**:
- Separates build environment from runtime
- Uses official OpenJDK slim images for reduced size
- Configurable with Spring profiles

### Todos API Dockerfile
```
FROM node:8.17.0
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
ENV TODO_API_PORT=8082
ENV JWT_SECRET=PRFT
ENV REDIS_HOST=azurerm_redis_cache.redis.hostname
ENV REDIS_PASSWORD=azurerm_redis_cache.redis.primary_access_key
ENV REDIS_PORT=6379
ENV REDIS_CHANNEL="log_channel"
EXPOSE $TODO_API_PORT
CMD ["node", "server.js"]
```
**Key features**:
- Uses official Node.js image
- Leverages Docker caching by separating dependency installation
- Configurable via environment variables for flexible deployment

### Frontend Dockerfile
```
# Build stage
FROM node:8.17.0 as build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Production stage
FROM nginx:1.21-alpine
COPY --from=build-stage /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```
**Key features**:
- Multi-stage build for optimized production deployment
- Builds Vue.js application and serves via Nginx
- Custom Nginx configuration for SPA routing

### Log Message Processor Dockerfile
```
FROM python:3.9-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
ENV REDIS_HOST=azurerm_redis_cache.redis.hostname
ENV REDIS_PASSWORD=azurerm_redis_cache.redis.primary_access_key
ENV REDIS_PORT=6379
ENV REDIS_CHANNEL="log_channel"
CMD ["python", "main.py"]
```
**Key features**:
- Uses official Python slim image for reduced size
- Separates dependency installation for better caching
- Configurable through environment variables

## CI/CD Pipeline with Azure DevOps

The project uses Azure DevOps Pipelines for continuous integration and deployment. The pipeline is defined in `azure-pipelines.yml` and consists of the following stages:

### Build Stage
- **Trigger**: Automatically runs on changes to the master branch
- **Process**:
  1. Builds Docker images for all microservices
  2. Pushes images to Azure Container Registry (ACR)
  3. Tags images with both build ID and "latest" tag

```yaml
- stage: Build
  displayName: 'Build and Push Images'
  jobs:
  - job: BuildAndPushImages
    displayName: 'Build and Push All Microservices'
    steps:
    - task: Docker@2  # Repeated for each microservice
      displayName: 'Build and Push [service-name]'
      inputs:
        command: buildAndPush
        containerRegistry: $(dockerRegistryServiceConnection)
        repository: '[service-name]'
        dockerfile: '$(System.DefaultWorkingDirectory)/[service-folder]/Dockerfile'
        buildContext: '$(System.DefaultWorkingDirectory)/[service-folder]'
        tags: |
          $(tag)
          latest
```

### Deployment Stage
- **Dependencies**: Runs after successful build stage completion
- **Process**:
  1. Updates container app revisions with new images
  2. Deploys backend services first (Auth API, Users API, Todos API, Log Processor)
  3. Deploys Frontend after backend services are updated
  4. Verifies deployment success with status checks

```yaml
- stage: Deploy
  displayName: 'Update Container Apps'
  dependsOn: Build
  jobs:
  - job: Update[ServiceName]
    displayName: 'Update [Service Name]'
    steps:
    - task: AzureCLI@2
      displayName: 'Update [Service Name] Container App'
      inputs:
        azureSubscription: 'AzureServiceConnect'
        scriptType: 'bash'
        scriptLocation: 'inlineScript'
        inlineScript: |
          az containerapp update -n [service-name] -g $(resourceGroup) \
            --image $(containerRegistry)/[service-name]:latest
```

### Deployment Strategy
- Backend services are deployed in parallel
- Frontend is deployed only after all backend services are successfully updated
- Each deployment includes validation steps to ensure successful deployment

### Pipeline Variables
- `dockerRegistryServiceConnection`: Connection to ACR
- `containerRegistry`: ACR URL
- `tag`: Build ID for versioning
- `resourceGroup`: Azure resource group for deployment

## Azure Infrastructure

The infrastructure is deployed on Azure using Container Apps, which provides a serverless container runtime with:

- **Azure Container Apps**: Hosting for all microservices with autoscaling
- **Azure Container Registry**: Storage for Docker images
- **Azure Redis Cache**: For session management, caching, and service communication
- **Azure Log Analytics**: Monitoring and logging for all services

![alt text](Arquitecture.jpg)

The infrastructure is provisioned using Terraform with a companion repository [microservice-infrastructure](https://github.com/darwinl-06/microservice-infrastructure).

## Local Development

### Prerequisites
- Docker and Docker Compose
- Node.js, Go, Java JDK, Python 3
- Git

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -am 'Add your feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Submit a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

