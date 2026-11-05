<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue'
import { onSlideLeave } from '@slidev/client'
defineProps<{ src: string; poster: string; label: string }>()
const video = ref<HTMLVideoElement>()
const asset = (path: string) => `${import.meta.env.BASE_URL}presentation/${path}`
const pause = () => video.value?.pause()
onSlideLeave(pause)
onBeforeUnmount(pause)
</script>
<template>
  <video ref="video" class="demo-clip" controls playsinline preload="auto" muted :poster="asset(`images/${poster}`)" :aria-label="label">
    <source :src="asset(`clips/${src.replace(/\.mp4$/, '.webm')}`)" type="video/webm" />
    <source :src="asset(`clips/${src}`)" type="video/mp4" />
    {{ label }}
  </video>
</template>
