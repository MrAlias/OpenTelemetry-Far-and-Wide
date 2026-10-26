<script setup lang="ts">
import model from '../../presentation/data/savings-assumptions.json'
import { calculateSavings } from '../../presentation/savings-model.js'
defineProps<{ mode: 'demo' | 'fleet' }>()
const rows = model.scenarios.map(s => calculateSavings(model, s))
const demo = rows[0]
const money = (value: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value)
</script>
<template>
  <div v-if="mode === 'demo'" class="savings-demo" data-savings="demo">
    <table class="savings-ledger">
      <thead><tr><th>Person-hours</th><th>Before</th><th>With tools</th><th>Saved</th></tr></thead>
      <tbody>
        <tr><td>Initial setup</td><td>{{ demo.initialBaselineHours }}</td><td>{{ demo.initialSharedHours }}</td><td>{{ demo.initialHours }}</td></tr>
        <tr><td>Annual updates</td><td>{{ demo.lifecycleBaselineHours }}</td><td>{{ demo.lifecycleSharedHours }}</td><td>{{ demo.lifecycleHours }}</td></tr>
        <tr><td>Investigations</td><td>{{ demo.investigationBaselineHours }}</td><td>{{ demo.investigationSharedHours }}</td><td>{{ demo.investigationHours }}</td></tr>
      </tbody>
    </table>
    <div class="savings-total"><strong>{{ money(demo.firstYearValue) }}</strong><span>{{ demo.firstYearHours }} hours × {{ money(model.hourlyRate) }}<br>of engineering capacity</span></div>
  </div>
  <table v-else class="savings-scale" data-savings="fleet">
    <thead><tr><th>Services</th><th>Eligible left</th><th>First year</th><th>Then / year</th></tr></thead>
    <tbody><tr v-for="row in rows" :key="row.services"><td>{{ row.services.toLocaleString('en-US') }}</td><td>{{ row.remaining }}</td><td class="accent">{{ money(row.firstYearValue) }}</td><td>{{ money(row.recurringValue) }}</td></tr></tbody>
  </table>
</template>
