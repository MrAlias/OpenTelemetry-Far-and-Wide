<template>
  <section class="operator-choice" aria-label="Upstream Operator language-specific injection annotations compared with RIO's central namespace selection. RIO is a demo operator; an upstream home is an intent, not a committed roadmap.">
    <div class="operator-upstream">
      <h2>Upstream Operator <small>Workload or namespace opt-in</small></h2>
      <code class="annotation-prefix">instrumentation.opentelemetry.io/</code>
      <div class="annotation-keys"><code>inject-java: <span>"true"</span></code><code>inject-python: <span>"true"</span></code></div>
    </div>
    <svg class="choice-arrow" viewBox="0 0 90 80" aria-hidden="true"><path d="M8 40H75M55 20L75 40L55 60" stroke="var(--muted)" stroke-width="3" fill="none" /></svg>
    <div class="operator-namespace">
      <h2>RIO <small>Demo operator</small></h2>
      <code class="namespace-choice">namespaces: [<span>demo-apps</span>]</code>
      <svg viewBox="0 0 450 210" role="img" aria-label="One namespace choice fans out to supported Java, Python, Node, Ruby and .NET runtimes">
        <path d="M225 8V62M45 62H405M45 62V105M135 62V105M225 62V105M315 62V105M405 62V105" fill="none" stroke="var(--agent)" stroke-width="2" />
        <g v-for="(runtime, i) in ['Java', 'Python', 'Node', 'Ruby', '.NET']" :key="runtime" :transform="`translate(${45 + i * 90} 128)`">
          <rect x="-24" y="-24" width="48" height="48" rx="5" fill="var(--surface)" stroke="var(--agent)" stroke-width="2" />
          <path d="M-11 -6L-17 0L-11 6M11 -6L17 0L11 6" fill="none" stroke="var(--agent)" stroke-width="2" />
          <text y="65" text-anchor="middle" style="font-size:21px" fill="var(--muted)">{{ runtime }}</text>
        </g>
      </svg>
    </div>
  </section>
</template>
