<script setup lang="ts">
import type { InterviewDetailResponse } from '@features/interviews/model/interview.types'
import InterviewDetailPage from '@features/interviews/ui/InterviewDetailPage.vue'
import { buildInterviewSeoDescription, buildInterviewSeoTitle } from '@shared/seo/content'
import PageBannerSection from '@shared/ui/page/PageBannerSection.vue'
import { useSiteBanner } from '@shared/ui/page/useSiteBanner'
import { useManagedSeo } from '@shared/seo/use-managed-seo'

const route = useRoute()
const slug = computed(() => String(route.params.slug))
const city = computed(() => typeof route.params.city === 'string' ? route.params.city : undefined)

const { data, error } = await useAsyncData(`interview-${city.value || 'all'}-${slug.value}`, async () =>
  await $fetch<InterviewDetailResponse>(`/api/interviews/${slug.value}`, { query: { city: city.value } })
)

if (error.value || !data.value) {
  throw createError({ statusCode: 404, statusMessage: 'Interview not found' })
}
const { banner, isEnabled: isBannerEnabled } = useSiteBanner()

const interview = data.value.interview
const title = buildInterviewSeoTitle(interview)
const description = buildInterviewSeoDescription(interview)

const seo = useManagedSeo({ title, description, image: interview.coverImage, type: 'video.other' })

useSchemaOrg([
  defineVideo({
    name: interview.title,
    description: seo.description,
    thumbnailUrl: seo.imageUrl,
    uploadDate: interview.publishedAt || interview.updatedAt,
    url: seo.canonicalUrl,
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
