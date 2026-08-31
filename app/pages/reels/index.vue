<script setup lang="ts">
import type { ReelItem } from '@features/reels/model/reel.types'
import ReelsPage from '@features/reels/ui/ReelsPage.vue'
import PageBannerSection from '@shared/ui/page/PageBannerSection.vue'
import { useSiteBanner } from '@shared/ui/page/useSiteBanner'
import { useManagedSeo } from '@shared/seo/use-managed-seo'
import { usePageSeo } from '@shared/seo/use-page-seo'

const config = useRuntimeConfig()
const route = useRoute()
const city = computed(() => typeof route.params.city === 'string' ? route.params.city : undefined)

const { data, error } = await useAsyncData(`reels-list-${city.value || 'all'}`, async () =>
  await $fetch<ReelItem[]>('/api/reels', { query: { city: city.value } }))

if (error.value) {
  throw createError({
    statusCode: error.value.statusCode || 503,
    statusMessage: 'Reels are unavailable',
  })
}
const { banner, isEnabled: isBannerEnabled } = useSiteBanner()

const seo = await usePageSeo('reels', {
  title: `Рилсы — ${config.public.siteName}`,
  description: 'Короткие видео с предпринимателями: практический опыт, быстрые ответы и главные мысли героев проекта.',
  image: '',
})

useManagedSeo(seo.value)
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
