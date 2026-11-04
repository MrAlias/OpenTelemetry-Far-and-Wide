<script setup lang="ts">
import project from '../../presentation/data/injector-intro.json'
import { renderInjectorDiagram } from '../../presentation/injector-diagram.js'
const diagram = renderInjectorDiagram({ runtimes: project.runtimes })
const qr = `${import.meta.env.BASE_URL}presentation/${project.qr}`
</script>
<template>
  <section class="injector-intro" aria-label="OpenTelemetry Injector: a shared library that loads the matching language agent at process startup">
    <div class="injector-startup" v-html="diagram" />
    <aside class="injector-project">
      <a :href="project.url" target="_blank" rel="noopener noreferrer" aria-label="Open the upstream OpenTelemetry Injector project and documentation">
        <img :src="qr" width="280" height="280" alt="QR code for github.com/open-telemetry/opentelemetry-injector" />
        <strong>Project + docs</strong>
        <span>opentelemetry-injector</span>
      </a>
    </aside>
  </section>
</template>
