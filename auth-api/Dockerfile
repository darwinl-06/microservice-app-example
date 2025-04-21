# Use the official Golang image
FROM golang:1.18.2-alpine AS builder

# Set working directory
WORKDIR /app

# Copy go mod and sum files
COPY go.mod go.sum ./

# Download all dependencies
RUN go mod download

# Copy the source code
COPY . .

# Build the application
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o auth-api .

# Use a small alpine image for the final container
FROM alpine:3.16

# Install ca-certificates for HTTPS requests
RUN apk --no-cache add ca-certificates

WORKDIR /root/

# Copy the binary from the builder stage
COPY --from=builder /app/auth-api .

# Expose the port the service runs on
EXPOSE 8000

# Set default environment variables
ENV AUTH_API_PORT=8000
ENV USERS_API_ADDRESS=http://users-api:8080
ENV JWT_SECRET=PRFT

# Command to run the application
CMD ["./auth-api"]