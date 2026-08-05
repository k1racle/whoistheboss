<script setup lang="ts">
import type { InterviewDetailResponse } from '@features/interviews/model/interview.types'
import InterviewDetailPage from '@features/interviews/ui/InterviewDetailPage.vue'

const route = useRoute()
const config = useRuntimeConfig()
const slug = computed(() => String(route.params.slug))

const { data, error } = await useAsyncData(`interview-${slug.value}`, async () =>
  await $fetch<InterviewDetailResponse>(`/api/interviews/${slug.value}`)
)

if (error.value || !data.value) {
  throw createError({ statusCode: 404, statusMessage: 'Interview not found' })
}

useSeoMeta({
  title: () => `${data.value?.interview.metaTitle || data.value?.interview.title || 'Интервью'} — ${config.public.siteName}`,
  description: () => data.value?.interview.metaDesc || data.value?.interview.summary || config.public.siteDescription,
  ogTitle: () => `${data.value?.interview.metaTitle || data.value?.interview.title || 'Интервью'} — ${config.public.siteName}`,
  ogDescription: () => data.value?.interview.metaDesc || data.value?.interview.summary || config.public.siteDescription,
  ogType: 'video.other',
})
</script>

<template>
  <InterviewDetailPage
    v-if="data"
    :interview="data.interview"
    :related="data.related"
  />
</template>
