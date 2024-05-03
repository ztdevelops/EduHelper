FROM developwithzt/esd-buf-healthprobe-base:general-1.0 as proto-base
COPY buf.* .
COPY protos/ protos/
RUN buf generate

FROM python:3.11.7 as builder
WORKDIR /app
RUN pip install pyinstaller
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY --from=proto-base /app/pb/ /app/pb/
ENV PYTHONPATH /app/:/app/pb/:$PYTHONPATH
COPY src/ src/
RUN pyinstaller --onefile src/main.py

FROM debian:stable-slim
WORKDIR /app

# Install curl and other necessary utilities
RUN apt-get update && \
    apt-get install -y curl && \
    rm -rf /var/lib/apt/lists/*

# Download and install the gRPC health probe, used for checking the health of gRPC applications
RUN GRPC_HEALTH_PROBE_VERSION=v0.4.13 && \
    curl -sLo /bin/grpc_health_probe https://github.com/grpc-ecosystem/grpc-health-probe/releases/download/${GRPC_HEALTH_PROBE_VERSION}/grpc_health_probe-linux-arm64 && \
    chmod +x /bin/grpc_health_probe

COPY --from=builder /app/dist/main server
CMD ["./server"]