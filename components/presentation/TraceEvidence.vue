<script setup lang="ts">
withDefaults(defineProps<{ image: string; label: string; highlight?: boolean }>(), { highlight: false })
const asset = (image: string) => `${import.meta.env.BASE_URL}presentation/images/${image}`
</script>
<template>
  <figure class="trace-evidence" :aria-label="label">
    <svg viewBox="0 230 1280 470" role="img" :aria-label="label">
      <image :href="asset(image)" width="1280" height="720" />
      <g v-if="highlight" class="trace-highlight">
        <rect x="513" y="404" width="372" height="30" fill="#ffbf71" opacity="0.35" />
        <path d="M700 400V355" stroke="#ffbf71" stroke-width="3" />
        <rect x="530" y="300" width="400" height="58" rx="8" fill="#081725" stroke="#ffbf71" />
        <text x="730" y="338" text-anchor="middle" fill="#ffbf71" style="font-size:25px">151.8 ms before the first call</text>
      </g>
    </svg>
  </figure>
</template>
