<script setup lang="ts">
import type { InterviewListItem } from '@features/interviews/model/interview.types'
import InterviewsPage from '@features/interviews/ui/InterviewsPage.vue'

const config = useRuntimeConfig()

const { data } = await useAsyncData('interviews-list', async () => {
  try {
    return await $fetch<InterviewListItem[]>('/api/interviews')
  }
  catch {
    return []
  }
})

useSeoMeta({
  title: `Интервью — ${config.public.siteName}`,
  description: 'Интервью с основателями бизнеса. Видео, рилсы и истории решений.',
  ogTitle: `Интервью — ${config.public.siteName}`,
  ogDescription: 'Интервью с основателями бизнеса. Видео, рилсы и истории решений.',
})
</script>

<template>
  <InterviewsPage :interviews="data ?? []" />
</template>
