<script setup lang="ts">
import type { ReelItem } from '@features/reels/model/reel.types'
import ReelsPage from '@features/reels/ui/ReelsPage.vue'
import PageBannerSection from '@shared/ui/page/PageBannerSection.vue'
import { useSiteBanner } from '@shared/ui/page/useSiteBanner'

const config = useRuntimeConfig()

const { data, error } = await useAsyncData('reels-list', async () =>
  await $fetch<ReelItem[]>('/api/reels'))

if (error.value) {
  throw createError({
    statusCode: error.value.statusCode || 503,
    statusMessage: 'Reels are unavailable',
  })
}
const { banner, isEnabled: isBannerEnabled } = useSiteBanner()

useSeoMeta({
  title: `Рилсы — ${config.public.siteName}`,
  description: 'Короткие видео с предпринимателями и их быстрыми инсайтами.',
  ogTitle: `Рилсы — ${config.public.siteName}`,
  ogDescription: 'Короткие видео с предпринимателями и их быстрыми инсайтами.',
})
</script>

<template>
  <div class="flex flex-col">
    <ReelsPage :reels="data ?? []" />
    <PageBannerSection
      v-if="isBannerEnabled('/reels')"
      :desktop-image="banner.image"
      :mobile-image="banner.mobileImage"
      :href="banner.link"
    />
  </div>
</template>
