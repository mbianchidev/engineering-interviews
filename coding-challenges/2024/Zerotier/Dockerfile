# Use the official Golang image for building the application
FROM golang:1.18 as builder

# Set the working directory
WORKDIR /app

# Copy the go.mod and go.sum files
COPY go.mod go.sum ./

# Download and cache the dependencies
RUN go mod download

# Copy the source code
COPY . .

# Build the application
RUN CGO_ENABLED=0 GOOS=linux go build -o /zerotier-webhook-service main.go

# Use a minimal base image for the final container
FROM alpine:latest

# Set the working directory
WORKDIR /root/

# Install SQLite
RUN apk --no-cache add sqlite

# Copy the built binary from the builder stage
COPY --from=builder /zerotier-webhook-service .

# Expose the application port
EXPOSE 8080

# Run the application
CMD ["./zerotier-webhook-service"]
