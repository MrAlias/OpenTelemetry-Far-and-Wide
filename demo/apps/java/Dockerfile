FROM gradle:8.14.4-jdk21-noble AS build
WORKDIR /src
COPY build.gradle settings.gradle ./
COPY src ./src
RUN gradle --no-daemon installDist

FROM eclipse-temurin:21-jre-noble
WORKDIR /app
COPY --from=build /src/build/install/commerce/lib ./lib
USER 10001:10001
ENTRYPOINT ["java", "--add-modules", "jdk.httpserver", "-cp", "/app/lib/*", "demo.commerce.Service"]
