FROM golang:1.26.8 AS gateway-build
WORKDIR /src
COPY gateway.go .
RUN CGO_ENABLED=0 go build -o /gateway gateway.go

FROM scratch AS gateway
COPY --from=gateway-build /gateway /app/gateway
ENTRYPOINT ["/app/gateway"]

FROM node:24-bookworm AS inventory
COPY inventory.js /app/inventory.js
ENTRYPOINT ["node", "/app/inventory.js"]

FROM gradle:8.14.4-jdk21-noble AS checkout
WORKDIR /app
COPY checkout/*.java ./src/
RUN javac --add-modules jdk.httpserver -d classes src/*.java
ENTRYPOINT ["java", "--add-modules", "jdk.httpserver", "-cp", "/app/classes", "demo.checkout.Checkout"]
