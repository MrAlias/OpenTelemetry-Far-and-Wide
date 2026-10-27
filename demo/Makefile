CLUSTER ?= far-wide-demo
LANGUAGES := go java dotnet python rails
IMAGES := far-wide-demo-gateway:local far-wide-demo-checkout:local far-wide-demo-inventory:local $(foreach language,$(LANGUAGES),far-wide-demo-$(language):local)

.PHONY: images load smoke pricing-fixed-image pricing-fixed-load

# Run from any directory: Make enters demo/ before invoking these recipes.
images:
	docker build --target gateway -t far-wide-demo-gateway:local -f proof/apps/Dockerfile proof/apps
	docker build -t far-wide-demo-checkout:local -f apps/checkout/Dockerfile .
	docker build --target inventory -t far-wide-demo-inventory:local -f proof/apps/Dockerfile proof/apps
	@set -e; for language in $(LANGUAGES); do \
		docker build -t "far-wide-demo-$$language:local" "apps/$$language"; \
	done

load:
	kind load docker-image --name $(CLUSTER) $(IMAGES)

# The gateway must already be port-forwarded to localhost:8080.
smoke:
	python3 scripts/check-flow.py

# Resolve the seeded pricing delay without changing the default slow demo.
pricing-fixed-image:
	docker build -t far-wide-demo-checkout:pricing-fixed -f apps/checkout/Dockerfile --build-arg PRICING_SOURCE=apps/checkout/fixes/PricingEngine.java .

pricing-fixed-load:
	kind load docker-image --name $(CLUSTER) far-wide-demo-checkout:pricing-fixed
