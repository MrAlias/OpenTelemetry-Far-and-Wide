FROM golang:1.27.1 AS builder
WORKDIR /src
COPY .artifacts/obi/obi-v0.14.0-source-generated/ .
COPY agent/main.go ./cmd/far-wide-proof/main.go
RUN --mount=type=cache,target=/go/pkg/mod --mount=type=cache,target=/root/.cache/go-build \
    CGO_ENABLED=0 go build -o /agent ./cmd/far-wide-proof
FROM scratch
COPY --from=builder /agent /agent
COPY --from=builder /etc/ssl/certs /etc/ssl/certs
COPY --from=builder /src/LICENSE /src/NOTICE /src/NOTICES /licenses/
ENTRYPOINT ["/agent"]
