<script setup lang="ts">
import evidence from '../../presentation/data/resolution.json'
defineProps<{ compact?: boolean }>()
const before = evidence.before.requestMedianMs
const after = evidence.after.requestMedianMs
const rows = [{ label: 'Before', value: before, kind: 'before' }, { label: 'After', value: after, kind: 'after' }]
const duration = (ms: number) => ms >= 1000 ? { number: (ms / 1000).toFixed(2), unit: 's' } : { number: String(Math.round(ms)), unit: 'ms' }
const label = (ms: number) => `${duration(ms).number} ${duration(ms).unit}`
</script>
<template>
  <div v-if="compact" class="customer-callback" data-customer-result="closing">
    <strong class="closing-latency">{{ label(before) }} <span>→</span> {{ label(after) }}</strong>
    <div class="closing-scope"><strong>1 namespace</strong><span>14 agents + 4 with OBI</span></div>
  </div>
  <div v-else class="customer-result" data-customer-result="measured">
    <p class="result-label">Matched requests · median</p>
    <div v-for="row in rows" :key="row.kind" class="request-comparison" :class="row.kind">
      <span>{{ row.label }}</span>
      <div class="duration-track"><div :style="{ width: `${row.value / before * 100}%` }" /></div>
      <strong>{{ duration(row.value).number }} <small>{{ duration(row.value).unit }}</small></strong>
    </div>
  </div>
</template>
