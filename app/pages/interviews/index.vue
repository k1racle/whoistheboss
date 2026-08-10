<script setup lang="ts">
import type { InterviewListItem } from '@features/interviews/model/interview.types'
import InterviewsPage from '@features/interviews/ui/InterviewsPage.vue'
import PageBannerSection from '@shared/ui/page/PageBannerSection.vue'
import { useSiteBanner } from '@shared/ui/page/useSiteBanner'

const config = useRuntimeConfig()

const { data } = await useAsyncData('interviews-list', async () => {
  try {
    return await $fetch<InterviewListItem[]>('/api/interviews')
  }
  catch {
    return []
  }
})
const { banner, isEnabled: isBannerEnabled } = useSiteBanner()

useSeoMeta({
  title: `Интервью — ${config.public.siteName}`,
  description: 'Интервью с основателями бизнеса. Видео, рилсы и истории решений.',
  ogTitle: `Интервью — ${config.public.siteName}`,
  ogDescription: 'Интервью с основателями бизнеса. Видео, рилсы и истории решений.',
})
</script>

<template>
  <div class="flex flex-col">
    <InterviewsPage :interviews="data ?? []" />
    <PageBannerSection
      v-if="isBannerEnabled('/interviews')"
      :desktop-image="banner.image"
      :mobile-image="banner.mobileImage"
      :href="banner.link"
    />
  </div>
</template>
