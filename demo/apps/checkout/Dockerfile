# Build from demo/. The deployment's legacy endpoint setting seeds the delay.
FROM gradle:8.14.4-jdk21-noble AS build
WORKDIR /src
COPY apps/checkout/build.gradle apps/checkout/settings.gradle ./
COPY apps/checkout/src ./src
RUN gradle --no-daemon installDist

FROM eclipse-temurin:21-jre-noble
WORKDIR /app
COPY --from=build /src/build/install/checkout/lib ./lib
COPY --chmod=755 apps/checkout/launch.sh ./launch.sh
ENTRYPOINT ["/app/launch.sh"]
