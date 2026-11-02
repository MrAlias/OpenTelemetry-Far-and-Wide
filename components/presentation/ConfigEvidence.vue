<script setup lang="ts">
import evidence from '../../presentation/data/timeout-evidence.json'
import captures from '../../presentation/data/attribute-captures.json'
const capture = captures.configuration
const image = `${import.meta.env.BASE_URL}presentation/images/${capture.image}`
</script>
<template>
  <figure class="configuration-evidence" :data-trace-id="captures.traceId" :data-span-id="captures.spanId" aria-label="Grafana screenshots of Checkout resource attributes and its configured legacy endpoint">
    <a :href="image" target="_blank" rel="noopener noreferrer" title="Open the full dashboard screenshot">
      <svg :viewBox="capture.context.join(' ')" :style="{ aspectRatio: `${capture.context[2]} / ${capture.context[3]}` }" role="img" aria-label="Actual Grafana Resource attributes panel: service.name checkout; service.namespace demo-apps">
        <image :href="image" :width="capture.width" :height="capture.height" />
      </svg>
    </a>
    <a :href="image" target="_blank" rel="noopener noreferrer" title="Open the full dashboard screenshot">
      <svg :viewBox="capture.setting.join(' ')" :style="{ aspectRatio: `${capture.setting[2]} / ${capture.setting[3]}` }" role="img" :aria-label="`Actual Grafana resource attribute: ${evidence.environmentKey} = ${evidence.environmentValue}`">
        <image :href="image" :width="capture.width" :height="capture.height" />
      </svg>
    </a>
  </figure>
</template>
