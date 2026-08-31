<script setup lang="ts">
import type { InterviewListItem } from '@features/interviews/model/interview.types'
import InterviewsPage from '@features/interviews/ui/InterviewsPage.vue'
import PageBannerSection from '@shared/ui/page/PageBannerSection.vue'
import { useSiteBanner } from '@shared/ui/page/useSiteBanner'
import { useManagedSeo } from '@shared/seo/use-managed-seo'
import { usePageSeo } from '@shared/seo/use-page-seo'

const config = useRuntimeConfig()
const route = useRoute()
const city = computed(() => typeof route.params.city === 'string' ? route.params.city : undefined)

const { data, error } = await useAsyncData(`interviews-list-${city.value || 'all'}`, async () =>
  await $fetch<InterviewListItem[]>('/api/interviews', { query: { city: city.value } }))

if (error.value) {
  throw createError({
    statusCode: error.value.statusCode || 503,
    statusMessage: 'Interviews are unavailable',
  })
}
const { banner, isEnabled: isBannerEnabled } = useSiteBanner()

const seo = await usePageSeo('interviews', {
  title: `Интервью — ${config.public.siteName}`,
  description: 'Видеоинтервью с предпринимателями и основателями бизнеса о решениях, трудностях, командах и развитии проектов.',
  image: '',
})

useManagedSeo(seo.value)
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
