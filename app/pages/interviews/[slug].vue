<script setup lang="ts">
import type { InterviewDetailResponse } from '@features/interviews/model/interview.types'
import InterviewDetailPage from '@features/interviews/ui/InterviewDetailPage.vue'
import PageBannerSection from '@shared/ui/page/PageBannerSection.vue'
import { useSiteBanner } from '@shared/ui/page/useSiteBanner'

const route = useRoute()
const config = useRuntimeConfig()
const slug = computed(() => String(route.params.slug))

const { data, error } = await useAsyncData(`interview-${slug.value}`, async () =>
  await $fetch<InterviewDetailResponse>(`/api/interviews/${slug.value}`)
)

if (error.value || !data.value) {
  throw createError({ statusCode: 404, statusMessage: 'Interview not found' })
}
const { banner, isEnabled: isBannerEnabled } = useSiteBanner()

useSeoMeta({
  title: () => `${data.value?.interview.metaTitle || data.value?.interview.title || 'Интервью'} — ${config.public.siteName}`,
  description: () => data.value?.interview.metaDesc || data.value?.interview.summary || config.public.siteDescription,
  ogTitle: () => `${data.value?.interview.metaTitle || data.value?.interview.title || 'Интервью'} — ${config.public.siteName}`,
  ogDescription: () => data.value?.interview.metaDesc || data.value?.interview.summary || config.public.siteDescription,
  ogType: 'video.other',
})
</script>

<template>
  <div class="flex flex-col">
    <InterviewDetailPage
      v-if="data"
      :interview="data.interview"
      :related="data.related"
    />
    <PageBannerSection
      v-if="isBannerEnabled('/interviews/SLUG')"
      :desktop-image="banner.image"
      :mobile-image="banner.mobileImage"
      :href="banner.link"
    />
  </div>
</template>
