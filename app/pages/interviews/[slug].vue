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

const interview = data.value.interview
const title = `${interview.metaTitle || interview.title} — ${config.public.siteName}`
const description = interview.metaDesc || interview.summary || config.public.siteDescription

useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description,
  ogType: 'video.other',
  ogImage: interview.coverImage || undefined,
  twitterCard: interview.coverImage ? 'summary_large_image' : 'summary',
  twitterImage: interview.coverImage || undefined,
})

useSchemaOrg([
  defineVideo({
    name: interview.title,
    description,
    thumbnailUrl: interview.coverImage || undefined,
    uploadDate: interview.publishedAt || interview.updatedAt,
    embedUrl: interview.videoType === 'EMBED' ? interview.videoUrl || undefined : undefined,
    contentUrl: interview.videoType === 'SELF_HOSTED' ? interview.videoFile || interview.videoUrl || undefined : undefined,
  }),
  defineBreadcrumb({
    itemListElement: [
      { name: 'Главная', item: '/' },
      { name: 'Интервью', item: '/interviews' },
      { name: interview.title },
    ],
  }),
])
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
