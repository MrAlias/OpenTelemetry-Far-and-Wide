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
      <thead><tr><th>Work</th><th>Distributed<br>ownership</th><th>Centralized<br>RIO + Injector</th><th>Saved</th></tr></thead>
      <tbody>
        <tr><td>One-time setup · hours</td><td>{{ demo.initialBaselineHours }}</td><td>{{ demo.initialSharedHours }}</td><td>{{ demo.initialHours }}</td></tr>
        <tr><td>Monthly updates · hours/year</td><td>{{ demo.lifecycleBaselineHours }}</td><td>{{ demo.lifecycleSharedHours }}</td><td>{{ demo.lifecycleHours }}</td></tr>
        <tr><td>Update operations / year</td><td>{{ demo.distributedAnnualUpdates }}</td><td>{{ demo.centralizedAnnualUpdates }}</td><td>144 fewer</td></tr>
      </tbody>
    </table>
    <div class="savings-total"><strong>{{ money(demo.firstYearValue) }}</strong><span>{{ demo.firstYearHours }} hours × {{ money(model.hourlyRate) }}<br>of engineering capacity</span></div>
  </div>
  <table v-else class="savings-scale" data-savings="fleet">
    <thead><tr><th>Services</th><th>Eligible left</th><th>Domains</th><th>First year</th><th>Then / year</th></tr></thead>
    <tbody><tr v-for="row in rows" :key="row.services"><td>{{ row.services.toLocaleString('en-US') }}</td><td>{{ row.remaining }}</td><td>{{ row.domains }}</td><td class="accent">{{ money(row.firstYearValue) }}</td><td>{{ money(row.recurringValue) }}</td></tr></tbody>
  </table>
</template>
