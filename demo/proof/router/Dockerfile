FROM golang:1.27.1 AS builder
WORKDIR /src
COPY main.go .
RUN CGO_ENABLED=0 go build -o /router main.go
FROM scratch
COPY --from=builder /router /app/router
ENTRYPOINT ["/app/router"]
