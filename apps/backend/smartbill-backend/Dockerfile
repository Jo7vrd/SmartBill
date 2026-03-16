# Stage 1: Build binary
FROM golang:1.26-alpine AS builder

RUN apk add --no-cache git
WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -o /smartbill-app cmd/api/main.go

# Stage 2: Run binary
FROM alpine:latest
RUN apk --no-cache add ca-certificates
WORKDIR /root/
COPY --from=builder /smartbill-app .
COPY --from=builder /app/.env . 

EXPOSE 8080

CMD ["./smartbill-app"]