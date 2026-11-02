<script setup lang="ts">
import { computed } from 'vue'
import example from '../../presentation/data/operator-complexity.json'
const props = defineProps<{ step: number }>()
const rows = computed(() => example.annotations.filter(row => row.at <= props.step))
</script>
<template>
  <section class="operator-configuration" :data-operator-step="step" aria-label="Progressive upstream OpenTelemetry Operator example: runtime compatibility, container targeting, process boundaries, startup hooks and application-team coordination">
    <div class="operator-example">
      <p class="operator-scope">OpenTelemetry Operator · {{ example.example }}</p>
      <code class="operator-key-prefix">{{ example.annotationPrefix }}</code>
      <div class="operator-annotations" aria-label="Annotation keys; prepend the prefix shown above to every key">
        <div v-for="row in rows" :key="row.key" :data-annotation="row.key" :class="{ 'operator-new-line': row.at === step }"><code><span class="operator-yaml-key">{{ row.key }}</span>: <span class="operator-yaml-value">"{{ row.value }}"</span></code></div>
      </div>
      <div v-if="step >= 1" class="operator-payload" data-python-payload><span>{{ example.pythonPayload.field }}</span><code>{{ example.pythonPayload.image }}</code></div>
      <div v-if="step === 4" class="operator-startup" data-startup-example>
        <span>api / entrypoint.sh</span>
        <code>exec python <strong>-I -S</strong> /app/reporting.py</code>
      </div>
      <div v-if="step === 5" class="operator-release-checks"><span>Payload</span><span>Permissions</span><span>Export</span><span>Rollout</span></div>
    </div>
    <div class="operator-context">
      <h2>{{ example.steps[step] }}</h2>
      <svg v-if="step < 2" viewBox="0 0 384 355" role="img" :aria-label="step ? 'The API image uses Python 3.12 and musl; native dependencies must match the runtime and libc' : 'A Python API container in the reporting-api pod'">
        <rect x="20" y="25" width="344" height="300" rx="8" fill="none" stroke="var(--line)" stroke-width="2" />
        <text x="40" y="60" style="font-size:19px" fill="var(--muted)">Pod</text>
        <rect x="90" y="90" width="204" height="110" rx="5" fill="var(--surface)" stroke="var(--accent)" stroke-width="2" />
        <text x="192" y="130" text-anchor="middle" style="font-size:26px" fill="var(--ink)">api</text>
        <text x="192" y="172" text-anchor="middle" style="font-size:23px" fill="var(--accent)">{{ step ? 'Python 3.12' : 'Python' }}</text>
        <g v-if="step === 1">
          <path d="M192 200V225M100 225H284M100 225V242M284 225V242" fill="none" stroke="var(--line)" stroke-width="2" />
          <rect x="53" y="242" width="94" height="46" rx="4" fill="var(--surface)" stroke="var(--line)" /><text x="100" y="273" text-anchor="middle" style="font-size:23px" fill="var(--muted)">glibc</text>
          <rect x="237" y="242" width="94" height="46" rx="4" fill="var(--surface)" stroke="var(--agent)" stroke-width="2" /><text x="284" y="273" text-anchor="middle" style="font-size:23px" fill="var(--agent)">musl</text>
        </g>
      </svg>
      <svg v-else-if="step < 4" viewBox="0 0 384 355" role="img" :aria-label="step === 2 ? 'One pod contains a Python api and a .NET worker; each needs the correct language-specific container mapping' : 'The api container launches both Python and Node processes. Upstream multi-instrumentation does not support multiple language instrumentations in the same container.'">
        <rect x="10" y="25" width="364" height="305" rx="8" fill="none" stroke="var(--line)" stroke-width="2" />
        <text x="30" y="60" style="font-size:19px" fill="var(--muted)">Pod</text>
        <rect x="25" y="90" :width="step === 3 ? 220 : 160" height="210" rx="5" fill="var(--surface)" stroke="var(--accent)" stroke-width="2" />
        <text :x="step === 3 ? 135 : 105" y="130" text-anchor="middle" style="font-size:26px" fill="var(--ink)">api</text>
        <text v-if="step === 2" x="105" y="205" text-anchor="middle" style="font-size:24px" fill="var(--accent)">Python</text>
        <g v-if="step === 3">
          <path d="M135 148V175M75 175H195M75 175V211M195 175V211" fill="none" stroke="var(--warning)" stroke-width="2" />
          <text x="75" y="242" text-anchor="middle" style="font-size:21px" fill="var(--accent)">Python</text>
          <text x="195" y="242" text-anchor="middle" style="font-size:21px" fill="var(--warning)">Node</text>
          <text x="135" y="282" text-anchor="middle" style="font-size:17px" fill="var(--muted)">two language processes</text>
        </g>
        <rect :x="step === 3 ? 260 : 200" y="90" :width="step === 3 ? 100 : 160" height="210" rx="5" fill="var(--surface)" stroke="var(--agent)" stroke-width="2" />
        <text :x="step === 3 ? 310 : 280" y="130" text-anchor="middle" style="font-size:23px" fill="var(--ink)">worker</text>
        <text :x="step === 3 ? 310 : 280" y="205" text-anchor="middle" style="font-size:24px" fill="var(--agent)">.NET</text>
      </svg>
      <svg v-else-if="step === 4" viewBox="0 0 384 355" role="img" aria-label="The Operator sets PYTHONPATH on the pod, but Python isolated mode ignores PYTHON environment variables and -S skips site initialization; the startup hook is not loaded">
        <text x="192" y="58" text-anchor="middle" style="font-size:21px" fill="var(--muted)">Pod environment</text>
        <text x="192" y="108" text-anchor="middle" style="font-size:28px" fill="var(--agent)">PYTHONPATH</text>
        <path d="M192 130V208M181 197L192 208L203 197" fill="none" stroke="var(--line)" stroke-width="2" />
        <path d="M174 151L210 187M210 151L174 187" stroke="var(--warning)" stroke-width="4" />
        <text x="192" y="252" text-anchor="middle" style="font-size:28px" fill="var(--warning)">python -I -S</text>
        <text x="192" y="307" text-anchor="middle" style="font-size:21px" fill="var(--muted)">startup hook skipped</text>
      </svg>
      <svg v-else viewBox="0 0 384 355" role="img" aria-label="Application team supplies image and startup facts; platform team validates the payload and configuration; application rollout and a real trace complete the work. Waiting between teams can extend the task.">
        <path d="M192 105V144M181 133L192 144L203 133M192 220V259M181 248L192 259L203 248" fill="none" stroke="var(--line)" stroke-width="2" />
        <g v-for="(item, i) in [['App team', 'Image + startup'], ['Platform', 'Payload + configuration'], ['Release', 'Restart + trace']]" :key="i" :transform="`translate(42 ${i * 115 + 23})`">
          <rect width="300" height="82" rx="5" fill="var(--surface)" stroke="var(--line)" />
          <text x="150" y="32" text-anchor="middle" style="font-size:24px" fill="var(--ink)">{{ item[0] }}</text>
          <text x="150" y="62" text-anchor="middle" style="font-size:19px" fill="var(--muted)">{{ item[1] }}</text>
        </g>
      </svg>
    </div>
  </section>
</template>
