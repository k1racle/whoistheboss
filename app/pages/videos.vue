<script setup lang="ts">
import type { EntrepreneurVideoItem } from '@features/videos/model/video.types'
import VideosPage from '@features/videos/ui/VideosPage.vue'
import { SEO_SITE_NAME } from '@shared/seo/brand'
import { useManagedSeo } from '@shared/seo/use-managed-seo'

const { data, error } = await useAsyncData('videos-list', async () =>
  await $fetch<EntrepreneurVideoItem[]>('/api/videos'))

if (error.value) {
  throw createError({
    statusCode: error.value.statusCode || 503,
    statusMessage: 'Videos are unavailable',
  })
}

useManagedSeo({
  title: `Все видео — интервью с предпринимателями | ${SEO_SITE_NAME}`,
  description: `${SEO_SITE_NAME}: все видеоинтервью с предпринимателями и основателями компаний России о бизнесе, командах, решениях и развитии проектов.`,
  titleBrandMode: 'always',
})
</script>

<template>
  <VideosPage :videos="data ?? []" />
</template>
