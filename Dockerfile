# Build frontend
FROM node:20-alpine AS builder-node
WORKDIR /app

COPY . .
RUN cd frontend && npm ci

ARG DOMAIN_NAME
ARG PLAUSIBLE_API_HOST
RUN cd frontend && echo "VITE_DOMAIN=${DOMAIN_NAME}\nVITE_PLAUSIBLE_API_HOST=${PLAUSIBLE_API_HOST}" > .env

RUN cd frontend && npm run build:client


# Build backend
FROM golang:1.23-alpine AS builder-go
WORKDIR /app

COPY --from=builder-node /app/backend .
COPY --from=builder-node /app/frontend/dist ./dist
RUN go mod download
RUN go build -tags production -o ethglobalprojectanalysis


# Deploy binary
FROM alpine:latest AS runner
WORKDIR /app

RUN mkdir -p /app/pb_data


COPY --from=builder-go /app/ethglobalprojectanalysis .
RUN chmod +x /app/ethglobalprojectanalysis



EXPOSE 8090

CMD ["/app/ethglobalprojectanalysis", "serve", "--http=0.0.0.0:8090"]