# Build from demo/. The default retains the shared slow pricing example.
FROM gradle:8.14.4-jdk21-noble AS build
WORKDIR /src
COPY apps/checkout/build.gradle apps/checkout/settings.gradle ./
COPY apps/checkout/src ./src
ARG PRICING_SOURCE=apps/checkout/baseline/PricingEngine.java
COPY ${PRICING_SOURCE} ./src/main/java/demo/checkout/PricingEngine.java
RUN gradle --no-daemon installDist

FROM eclipse-temurin:21-jre-noble
WORKDIR /app
COPY --from=build /src/build/install/checkout/lib ./lib
ENTRYPOINT ["java", "--add-modules", "jdk.httpserver", "-cp", "/app/lib/*", "demo.checkout.Checkout"]
