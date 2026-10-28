<script setup lang="ts">
import evidence from '../../presentation/data/resolution.json'
defineProps<{ compact?: boolean }>()
const before = Math.round(evidence.before.requestMedianMs)
const after = Math.round(evidence.after.requestMedianMs)
const maximum = Math.max(before, after)
const rows = [{label:'Before the fix', value:before, kind:'before'}, {label:'After the fix', value:after, kind:'after'}]
const duration = (ms: number) => ms >= 1000 ? { number: (ms / 1000).toFixed(2), unit: 's' } : { number: String(Math.round(ms)), unit: 'ms' }
const label = (ms: number) => `${duration(ms).number} ${duration(ms).unit}`
</script>
<template>
  <div v-if="compact" class="customer-callback" data-customer-result="closing">
    <div><strong>{{ label(before) }} → {{ label(after) }}</strong><span>Customer request · matched median</span></div>
    <div><strong>One namespace</strong><span>14 language agents · 4 services with OBI</span></div>
  </div>
  <div v-else class="customer-result" data-customer-result="measured">
    <p class="result-label">Customer request · median duration</p>
    <div v-for="row in rows" :key="row.kind" class="request-comparison" :class="row.kind">
      <span>{{ row.label }}</span><div class="duration-track"><div :style="{width: `${row.value / maximum * 100}%`}" /></div><strong>{{ duration(row.value).number }} <small>{{ duration(row.value).unit }}</small></strong>
    </div>
    <p class="pricing-payoff"><code>PricingEngine.calculate</code><br><span>{{ label(evidence.before.pricingMedianMs) }} → {{ evidence.after.pricingMedianMs.toFixed(2) }} ms</span></p>
    <p class="result-method">Matched warmed requests · same instrumentation · local demo</p>
    <p class="result-method">The successful price lookup and checkout path remain.</p>
  </div>
</template>
