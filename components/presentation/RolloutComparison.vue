<script setup lang="ts">
import model from '../../presentation/data/savings-assumptions.json'
import { renderAdoptionChart, renderCostChart } from '../../presentation/rollout-charts.js'
defineProps<{ mode: 'adoption' | 'cost' }>()
</script>
<template>
  <div class="rollout-comparison" :data-rollout-chart="mode" v-html="mode === 'adoption' ? renderAdoptionChart() : renderCostChart(model)" />
</template>
