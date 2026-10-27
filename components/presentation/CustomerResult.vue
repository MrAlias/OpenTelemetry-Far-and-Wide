<script setup lang="ts">
import evidence from '../../presentation/data/resolution.json'
defineProps<{ compact?: boolean }>()
const before = Math.round(evidence.before.requestMedianMs)
const after = Math.round(evidence.after.requestMedianMs)
const maximum = Math.max(before, after)
const rows = [{label:'Before the fix', value:before, kind:'before'}, {label:'After the fix', value:after, kind:'after'}]
</script>
<template>
  <div v-if="compact" class="customer-callback" data-customer-result="closing">
    <div><strong>{{ before }} → {{ after }} ms</strong><span>Customer request · matched median</span></div>
    <div><strong>One namespace</strong><span>14 language agents · 4 services with OBI</span></div>
  </div>
  <div v-else class="customer-result" data-customer-result="measured">
    <p class="result-label">Customer request · median duration</p>
    <div v-for="row in rows" :key="row.kind" class="request-comparison" :class="row.kind">
      <span>{{ row.label }}</span><div class="duration-track"><div :style="{width: `${row.value / maximum * 100}%`}" /></div><strong>{{ row.value }} <small>ms</small></strong>
    </div>
    <p class="pricing-payoff"><code>PricingEngine.calculate</code><br><span>{{ evidence.before.pricingMedianMs.toFixed(1) }} ms → {{ evidence.after.pricingMedianMs.toFixed(2) }} ms</span></p>
    <p class="result-method">Matched warmed requests · same instrumentation · local demo</p>
    <p class="result-method">The successful price lookup and checkout path remain.</p>
  </div>
</template>
