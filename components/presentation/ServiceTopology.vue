<script setup lang="ts">
import { computed } from 'vue'
import topology from '../../presentation/data/topology.json'
import request from '../../presentation/data/request.json'
const props = withDefaults(defineProps<{ phase?: 'plain' | 'observed' | 'one' | 'complete' }>(), { phase: 'plain' })
const branch = new Set(request.highlightedBranch)
const observed = computed(() => props.phase === 'observed')
const hasAgent = (node: typeof topology.nodes[number]) => node.eligible && (props.phase === 'complete' || props.phase === 'one' && node.id === 'checkout')
const tone = (node: typeof topology.nodes[number]) => hasAgent(node) ? 'agent' : observed.value && !branch.has(node.id) ? 'dim' : props.phase === 'plain' ? 'neutral' : 'obi'
const path = (points: number[][]) => `M${points[0].join(' ')} ` + Array.from({ length: (points.length - 1) / 3 }, (_, i) => `C${points.slice(i * 3 + 1, i * 3 + 4).map(p => p.join(' ')).join(' ')}`).join(' ')
const timing = (id: string) => { const ms = (request.serverDurationMs as Record<string, number>)[id]; return ms >= 1000 ? `${(ms / 1000).toFixed(2)} s` : `${ms.toFixed(1)} ms` }
</script>
<template>
  <svg class="service-topology" viewBox="45 185 1195 440" role="img" :aria-label="`Eighteen application services; ${phase === 'complete' ? 'fourteen language agents and four Go services with OBI' : 'request topology'}`">
    <defs><marker id="topology-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0 0L10 5L0 10" fill="none" stroke="context-stroke" stroke-width="1.5" /></marker></defs>
    <g class="topology-links">
      <path v-for="edge in topology.edges" :key="`${edge.from}:${edge.to}`" :d="path(edge.points)" :data-edge="`${edge.from}:${edge.to}`" :class="{ 'branch-link': observed && branch.has(edge.from) && branch.has(edge.to), 'dim-link': observed && !(branch.has(edge.from) && branch.has(edge.to)) }" marker-end="url(#topology-arrow)" />
    </g>
    <g v-for="node in topology.nodes" :key="node.id" :data-service="node.id" :data-agent="hasAgent(node)" :class="`topology-node ${tone(node)}`">
      <rect :x="node.x - node.w / 2" :y="node.y - (node.h + 8) / 2" :width="node.w" :height="node.h + 8" rx="5" />
      <text :x="node.x" :y="node.y + (phase === 'plain' || observed && !branch.has(node.id) ? 7 : -5)" class="node-name">{{ node.label }}</text>
      <text v-if="phase === 'one' || phase === 'complete' || observed && branch.has(node.id)" :x="node.x" :y="node.y + 22" class="node-runtime">{{ observed && branch.has(node.id) ? timing(node.id) : node.runtime }}</text>
      <circle v-if="hasAgent(node)" :cx="node.x + node.w / 2 - 8" :cy="node.y - (node.h + 8) / 2 + 8" r="4" />
    </g>
    <g class="topology-databases">
      <line x1="60" y1="557" x2="1220" y2="557" />
      <text x="65" y="590">PostgreSQL</text>
      <text x="790" y="590">Redis</text>
    </g>
  </svg>
</template>
