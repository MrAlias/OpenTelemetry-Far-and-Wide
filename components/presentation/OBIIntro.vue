<script setup lang="ts">
import previous from '../../presentation/data/previous-talk.json'
const qr = `${import.meta.env.BASE_URL}presentation/${previous.qr}`
</script>
<template>
  <section class="obi-intro" aria-label="OpenTelemetry eBPF Instrumentation observes supported running Linux applications without application edits or restarts">
    <div class="obi-overview">
      <p class="obi-name">OpenTelemetry eBPF Instrumentation</p>
      <svg class="obi-diagram" viewBox="0 0 760 420" role="img" aria-label="OBI observes running applications from Linux and exports traces and metrics; zero application code edits and zero restarts">
        <g stroke="var(--line)" stroke-width="2" fill="none"><path d="M160 155V222M380 155V222M600 155V222M380 292V333" /><path d="M370 323L380 333L390 323" /></g>
        <text x="380" y="38" text-anchor="middle" style="font-size:25px" fill="var(--muted)">Running applications</text>
        <g v-for="(x, i) in [160, 380, 600]" :key="i" :transform="`translate(${x} 115)`">
          <rect x="-72" y="-42" width="144" height="84" rx="7" fill="var(--surface)" stroke="var(--line)" stroke-width="2" />
          <path d="M-22 -13L-36 0L-22 13M22 -13L36 0L22 13M8 -21L-8 21" fill="none" stroke="var(--ink)" stroke-width="3" />
        </g>
        <rect x="67" y="220" width="626" height="73" rx="6" fill="var(--surface)" stroke="var(--accent)" stroke-width="2" />
        <text x="104" y="266" style="font-size:29px" fill="var(--accent)">OBI / eBPF</text>
        <text x="651" y="265" text-anchor="end" style="font-size:24px" fill="var(--muted)">Linux</text>
        <text x="380" y="370" text-anchor="middle" style="font-size:28px" fill="var(--ink)">Traces + metrics</text>
      </svg>
      <div class="obi-zero"><span><strong>0</strong> code edits</span><span><strong>0</strong> restarts</span></div>
    </div>
    <aside class="obi-previous-talk">
      <a :href="previous.url" target="_blank" rel="noopener noreferrer" aria-label="Watch our previous CNCF talk: Debugging Your Cluster When It’s on Fire">
        <span class="obi-recording-label">{{ previous.location }} · {{ previous.year }}</span>
        <img :src="qr" width="256" height="256" alt="QR code for our previous CNCF talk">
        <strong>{{ previous.lines[0] }}<br>{{ previous.lines[1] }}</strong>
      </a>
    </aside>
  </section>
</template>
