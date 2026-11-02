<script setup lang="ts">
import { useSlideContext } from '@slidev/client'
const { $frontmatter, $page, $clicks } = useSlideContext()
</script>
<template>
  <div class="slidev-layout talk-layout" :class="{ 'evidence-slide': $frontmatter.evidence || ($frontmatter.mediaAt !== undefined && $clicks >= $frontmatter.mediaAt), 'title-free': $frontmatter.titleHidden, 'code-hero': $frontmatter.codeHero }">
    <main class="talk-content"><slot /></main>
    <footer class="talk-footer"><span>{{ String($page).padStart(2, '0') }}</span></footer>
  </div>
</template>
