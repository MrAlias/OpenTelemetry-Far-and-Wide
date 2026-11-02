<script setup lang="ts">
import evidence from '../../presentation/data/timeout-evidence.json'
defineProps<{ image: string }>()
const asset = (name: string) => `${import.meta.env.BASE_URL}presentation/images/${name}`
</script>
<template>
  <figure class="configuration-evidence" aria-label="Actual Checkout resource attribute matching the failed HTTP destination">
    <p>Checkout resource attribute</p>
    <svg viewBox="695 264 550 36" role="img" aria-label="Recorded Grafana resource attribute row">
      <image :href="asset(image)" width="1280" height="720" />
    </svg>
    <code>process.environment_variable.<br><strong>LEGACY_PRICING_URL</strong></code>
    <div class="configuration-value">{{ evidence.environmentValue }}</div>
    <figcaption>Same address as the failed HTTP span.</figcaption>
  </figure>
</template>
