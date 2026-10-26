<script setup lang="ts">
import { useSlideContext } from '@slidev/client'
const { $frontmatter, $page } = useSlideContext()
</script>
<template>
  <div class="slidev-layout talk-layout">
    <div class="talk-kicker">{{ $frontmatter.kicker || 'OpenTelemetry Far and Wide' }}</div>
    <main class="talk-content"><slot /></main>
    <footer class="talk-footer"><span>Tyler Yahn · Nikola Grcevski</span><span>{{ String($page).padStart(2, '0') }}</span></footer>
  </div>
</template>
