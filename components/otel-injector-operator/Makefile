ROOT := $(abspath ../..)
ARTIFACTS := $(ROOT)/.artifacts/injector-components
export GOCACHE := $(ARTIFACTS)/go-cache
export GOMODCACHE := $(ARTIFACTS)/go-mod-cache
export GOPATH := $(ARTIFACTS)/go
export GOTMPDIR := $(ARTIFACTS)/tmp
export TMPDIR := $(ARTIFACTS)/tmp
IMAGE ?= otel-injector-operator:demo

.PHONY: prepare test build image install uninstall
prepare:
	mkdir -p $(GOCACHE) $(GOMODCACHE) $(GOTMPDIR) $(ARTIFACTS)/bin
test: prepare
	go test -race ./...
build: prepare
	CGO_ENABLED=0 go build -trimpath -o $(ARTIFACTS)/bin/otel-injector-operator ./cmd/operator
image: prepare
	docker build -t $(IMAGE) .
install:
	./scripts/install.sh $(IMAGE)
uninstall:
	./scripts/uninstall.sh
