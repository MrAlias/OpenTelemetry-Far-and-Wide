<script setup lang="ts">
defineProps<{ mode: 'handoffs' | 'maintenance' }>()
const steps = ['Owner', 'Access', 'Review', 'Release']
const events = ['New service', 'Agent update', 'Configuration', 'Recovery']
const services = Array.from({ length: 13 }, (_, i) => ({ x: i === 12 ? 922.5 : 795 + (i % 4) * 85, y: 125 + Math.floor(i / 4) * 83 }))
</script>
<template>
  <svg v-if="mode === 'handoffs'" class="ownership-flow" viewBox="0 0 1152 520" role="img" aria-label="Owner, access, review and release involve active work separated by waiting, repeated across thirteen services. The spacing is conceptual, not a measured duration.">
    <defs><marker id="handoff-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M1 1L9 5L1 9" fill="none" stroke="var(--muted)" stroke-width="1.5" /></marker></defs>
    <g v-for="i in 3" :key="`link-${i}`">
      <path :d="`M${125 + (i - 1) * 245} 228H${260 + (i - 1) * 245}`" fill="none" stroke="var(--accent)" stroke-width="3" stroke-dasharray="5 8" marker-end="url(#handoff-arrow)" />
      <g :transform="`translate(${192 + (i - 1) * 245} 157)`" stroke="var(--accent)" fill="none" stroke-width="2.5"><circle r="20" /><path d="M0 -12V0L9 6" /></g>
    </g>
    <g v-for="(step, i) in steps" :key="step" :transform="`translate(${85 + i * 245} 228)`">
      <circle cy="-10" r="14" fill="none" stroke="var(--ink)" stroke-width="3" />
      <path d="M-25 30V20C-25 0 25 0 25 20V30" fill="none" stroke="var(--ink)" stroke-width="3" />
      <text y="87" text-anchor="middle" style="font-size:29px" fill="var(--ink)">{{ step }}</text>
    </g>
    <path d="M25 365V378H865V365" fill="none" stroke="var(--line)" stroke-width="2" />
    <text x="445" y="428" text-anchor="middle" style="font-size:25px" fill="var(--muted)">Work + waiting</text>
    <text x="955" y="262" style="font-size:78px" fill="var(--accent)" font-weight="500">×13</text>
    <text x="956" y="310" style="font-size:26px" fill="var(--muted)">services</text>
  </svg>
  <svg v-else class="ownership-flow" viewBox="0 0 1152 520" role="img" aria-label="New services, agent updates, configuration and recovery use one platform-owned path to the thirteen additional services.">
    <defs><marker id="maintenance-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M1 1L9 5L1 9" fill="none" stroke="var(--agent)" stroke-width="1.5" /></marker></defs>
    <g fill="none" stroke="var(--line)" stroke-width="2">
      <path v-for="(_, i) in events" :key="i" :d="`M300 ${105 + i * 100}H360Q395 ${105 + i * 100} 415 255H455`" />
      <path d="M635 255H712M712 125V374" stroke="var(--agent)" />
      <path v-for="(node, i) in services" :key="i" :d="`M712 255V${node.y}H${node.x - 27}`" stroke="var(--agent)" opacity=".45" />
    </g>
    <g v-for="(event, i) in events" :key="event">
      <circle cx="46" :cy="105 + i * 100" r="18" fill="var(--surface)" stroke="var(--line)" stroke-width="2" />
      <path :d="`M38 ${105 + i * 100}H54M46 ${97 + i * 100}V${113 + i * 100}`" stroke="var(--accent)" stroke-width="2" />
      <text x="85" :y="114 + i * 100" style="font-size:27px" fill="var(--ink)">{{ event }}</text>
    </g>
    <circle cx="545" cy="255" r="88" fill="var(--surface)" stroke="var(--agent)" stroke-width="3" />
    <path d="M520 222A35 35 0 1 1 515 267M515 244V267H538" fill="none" stroke="var(--agent)" stroke-width="3" />
    <text x="545" y="305" text-anchor="middle" style="font-size:24px" fill="var(--ink)">Platform</text>
    <g v-for="(node, i) in services" :key="i" :transform="`translate(${node.x} ${node.y})`">
      <rect x="-26" y="-23" width="52" height="46" rx="5" fill="var(--surface)" stroke="var(--agent)" stroke-width="2" />
      <path d="M-13 -6L-19 0L-13 6M13 -6L19 0L13 6M4 -10L-4 10" fill="none" stroke="var(--agent)" stroke-width="2" />
    </g>
    <text x="922" y="65" text-anchor="middle" style="font-size:26px" fill="var(--muted)">13 services</text>
  </svg>
</template>
