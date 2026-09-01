<script setup lang="ts">
import type { LandingPageData } from '@features/landing/model/landing.data'
import { landingPageFallback } from '@features/landing/model/landing.data'
import LandingPage from '@features/landing/ui/LandingPage.vue'
import { getStaticPageSeo } from '@shared/seo/static-page-seo'
import { useManagedSeo } from '@shared/seo/use-managed-seo'
import { usePageSeo } from '@shared/seo/use-page-seo'

const route = useRoute()
const city = computed(() => typeof route.params.city === 'string' ? route.params.city : undefined)

const { data, error } = await useAsyncData(`landing-page-${city.value || 'all'}`, async () =>
  await $fetch<LandingPageData>('/api/landing-page', { query: { city: city.value } }))

if (error.value) {
  throw createError({
    statusCode: error.value.statusCode || 503,
    statusMessage: 'Landing page is unavailable',
  })
}

const page = computed(() => data.value ?? landingPageFallback)
const seo = await usePageSeo('home', getStaticPageSeo('home'))

useManagedSeo(seo.value)
</script>

<template>
  <LandingPage
    :page="page"
    :city="city"
  />
</template>
