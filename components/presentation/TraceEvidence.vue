<script setup lang="ts">
import capture from '../../presentation/data/capture.json'
withDefaults(defineProps<{ image: string; label: string; highlight?: boolean }>(), { highlight: false })
const asset = (image: string) => `${import.meta.env.BASE_URL}presentation/images/${image}`
</script>
<template>
  <figure class="trace-evidence" :aria-label="label">
    <svg viewBox="0 280 1280 440" role="img" :aria-label="label">
      <image :href="asset(image)" width="1280" height="720" />
      <g v-if="highlight" class="trace-highlight">
        <rect x="510" :y="capture.baseline.failedConnectionRowY" :width="750 * capture.baseline.failedConnectionMs / capture.baseline.rootDurationMs" height="30" fill="#ffbf71" opacity="0.35" />
        <path :d="`M700 ${capture.baseline.failedConnectionRowY}V388`" stroke="#ffbf71" stroke-width="3" />
        <rect x="530" y="330" width="470" height="58" rx="8" fill="#081725" stroke="#ffbf71" />
        <text x="765" y="368" text-anchor="middle" fill="#ffbf71" style="font-size:25px">{{ (capture.baseline.failedConnectionMs / 1000).toFixed(2) }} s · failed connection</text>
      </g>
    </svg>
  </figure>
</template>
