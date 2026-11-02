<script setup lang="ts">
import evidence from '../../presentation/data/timeout-evidence.json'
const image = `${import.meta.env.BASE_URL}presentation/images/java-detail-poster.png`
</script>
<template>
  <figure class="timeout-evidence" aria-label="Captured failed HTTP client span and its literal timeout attributes">
    <svg viewBox="0 380 1280 205" role="img" :aria-label="`Checkout PricingEngine.calculate contains a failed GET lasting ${(evidence.durationMs / 1000).toFixed(2)} seconds`">
      <image :href="image" width="1280" height="720" />
    </svg>
    <p class="evidence-origin">Failed HTTP client span · {{ (evidence.durationMs / 1000).toFixed(2) }} s</p>
    <dl>
      <dt>url.full</dt><dd>{{ evidence.url }}</dd>
      <dt>error.type</dt><dd class="timeout-value">{{ evidence.errorType }}</dd>
      <dt>exception.message</dt><dd class="timeout-value">{{ evidence.exceptionMessage }}</dd>
    </dl>
    <figcaption>Actual span attributes and exception event · Java agent</figcaption>
  </figure>
</template>
