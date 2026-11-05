<script setup lang="ts">
import metrics from '../../presentation/data/metric-comparison.json'
defineProps<{ compact?: boolean }>()
const before = metrics.before.meanSeconds * 1000
const after = metrics.after.meanSeconds * 1000
const panels = [
  { label: 'Before fix', phase: 'before', ...metrics.before },
  { label: 'After fix', phase: 'after', ...metrics.after },
]
const asset = (image: string) => `${import.meta.env.BASE_URL}presentation/images/${image}`
const duration = (ms: number) => ms >= 1000 ? { number: (ms / 1000).toFixed(2), unit: 's' } : { number: String(Math.round(ms)), unit: 'ms' }
const label = (ms: number) => `${duration(ms).number} ${duration(ms).unit}`
</script>
<template>
  <div v-if="compact" class="customer-callback" data-customer-result="closing">
    <strong class="closing-latency" aria-label="Mean checkout duration before and after the fix">{{ label(before) }} <span>→</span> {{ label(after) }}</strong>
    <div class="closing-scope"><strong>1 namespace</strong><span>14 agents + 4 with OBI</span></div>
  </div>
  <div v-else class="customer-result" data-customer-result="metric-captures">
    <figure v-for="panel in panels" :key="panel.phase" :data-metric-phase="panel.phase" :data-mean-seconds="panel.meanSeconds">
      <figcaption>{{ panel.label }}</figcaption>
      <img :src="asset(panel.image)" :width="panel.width" :height="panel.height"
        :alt="`Actual Grafana capture: ${panel.label.toLowerCase()}, mean Gateway GET /checkout duration ${panel.displayValue}, from OBI metrics over a ${panel.windowSeconds}-second window.`" />
    </figure>
  </div>
</template>
