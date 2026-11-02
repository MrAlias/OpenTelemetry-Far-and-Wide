<script setup lang="ts">
import evidence from '../../presentation/data/timeout-evidence.json'
import captures from '../../presentation/data/attribute-captures.json'
const capture = captures.timeout
const image = `${import.meta.env.BASE_URL}presentation/images/${capture.image}`
</script>
<template>
  <figure class="timeout-evidence" :data-trace-id="captures.traceId" :data-span-id="captures.spanId" aria-label="Grafana screenshots of the failed Checkout HTTP client span">
    <a :href="image" target="_blank" rel="noopener noreferrer" title="Open the full dashboard screenshot">
      <svg :viewBox="capture.attributes.join(' ')" :style="{ aspectRatio: `${capture.attributes[2]} / ${capture.attributes[3]}` }" role="img" :aria-label="`Actual Grafana span attributes: url.full ${evidence.url}; error.type ${evidence.errorType}`">
        <image :href="image" :width="capture.width" :height="capture.height" />
      </svg>
    </a>
    <a :href="image" target="_blank" rel="noopener noreferrer" title="Open the full dashboard screenshot">
      <svg :viewBox="capture.event.join(' ')" :style="{ aspectRatio: `${capture.event[2]} / ${capture.event[3]}` }" role="img" :aria-label="`Actual Grafana exception event: exception.message ${evidence.exceptionMessage}; exception.type ${evidence.exceptionType}`">
        <image :href="image" :width="capture.width" :height="capture.height" />
      </svg>
    </a>
  </figure>
</template>
