FROM golang:1.26.8 AS build
WORKDIR /src
COPY main.go .
RUN CGO_ENABLED=0 go build -o /service main.go

FROM scratch
COPY --from=build /service /service
USER 65532:65532
ENTRYPOINT ["/service"]
