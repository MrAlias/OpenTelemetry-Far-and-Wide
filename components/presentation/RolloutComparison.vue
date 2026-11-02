<script setup lang="ts">
import model from '../../presentation/data/savings-assumptions.json'
import { renderAdoptionChart, renderCostChart } from '../../presentation/rollout-charts.js'
defineProps<{ mode: 'adoption' | 'cost' }>()
// SVG presentation attributes resolve these tokens in the slide's current theme.
const palette = {
  ink: 'var(--ink)', muted: 'var(--muted)', grid: 'var(--grid)',
  central: 'var(--agent)', distributed: 'var(--accent)', emphasis: 'var(--warning)',
}
</script>
<template>
  <div class="rollout-comparison" :data-rollout-chart="mode" v-html="mode === 'adoption' ? renderAdoptionChart(palette) : renderCostChart(model, palette)" />
</template>
