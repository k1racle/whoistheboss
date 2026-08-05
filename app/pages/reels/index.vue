<script setup lang="ts">
import type { ReelItem } from '@features/reels/model/reel.types'
import ReelsPage from '@features/reels/ui/ReelsPage.vue'

const config = useRuntimeConfig()

const { data } = await useAsyncData('reels-list', async () => {
  try {
    return await $fetch<ReelItem[]>('/api/reels')
  }
  catch {
    return []
  }
})

useSeoMeta({
  title: `Рилсы — ${config.public.siteName}`,
  description: 'Короткие видео с предпринимателями и их быстрыми инсайтами.',
  ogTitle: `Рилсы — ${config.public.siteName}`,
  ogDescription: 'Короткие видео с предпринимателями и их быстрыми инсайтами.',
})
</script>

<template>
  <ReelsPage :reels="data ?? []" />
</template>
