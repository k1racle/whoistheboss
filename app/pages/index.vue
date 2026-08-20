<script setup lang="ts">
import type { LandingPageData } from '@features/landing/model/landing.data'
import { landingPageFallback } from '@features/landing/model/landing.data'
import LandingPage from '@features/landing/ui/LandingPage.vue'

const config = useRuntimeConfig()

const { data, error } = await useAsyncData('landing-page', async () =>
  await $fetch<LandingPageData>('/api/landing-page'))

if (error.value) {
  throw createError({
    statusCode: error.value.statusCode || 503,
    statusMessage: 'Landing page is unavailable',
  })
}

const page = computed(() => data.value ?? landingPageFallback)

useSeoMeta({
  title: config.public.siteName,
  description: config.public.siteDescription,
  ogTitle: config.public.siteName,
  ogDescription: config.public.siteDescription,
  ogType: 'website',
  ogUrl: config.public.siteUrl,
})
</script>

<template>
  <LandingPage :page="page" />
</template>
