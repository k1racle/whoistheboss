<script setup lang="ts">
import type { EntrepreneursPageData } from '@features/entrepreneurs/model/entrepreneur.types'
import EntrepreneursPage from '@features/entrepreneurs/ui/EntrepreneursPage.vue'

const route = useRoute()
const config = useRuntimeConfig()
const city = computed(() => typeof route.params.city === 'string' ? route.params.city : undefined)

const fallbackPage: EntrepreneursPageData = {
  heroTitle: 'Маршрут\nпостроен',
  audienceTitle: 'Наши герои',
  audienceText: 'Истории предпринимателей, руководителей и создателей проектов.',
  heroesTitle: 'Герои',
  heroesText: 'Люди, которые стоят за своими проектами и формируют среду вокруг себя.',
  audienceCards: [],
  entrepreneurs: [],
  bannerImage: '',
  bannerMobileImage: '',
  bannerLink: '/',
  sectionOrder: ['hero', 'audience', 'heroes', 'cta', 'banner'],
  sectionVisibility: {},
}

const { data, error: pageError } = await useAsyncData(`entrepreneurs-page-${city.value || 'all'}`, async () =>
  await $fetch<EntrepreneursPageData>('/api/entrepreneurs-page', { query: { city: city.value } }))

if (pageError.value) {
  throw createError({
    statusCode: pageError.value.statusCode || 503,
    statusMessage: 'Entrepreneurs page is unavailable',
  })
}

const page = computed(() => data.value ?? fallbackPage)
const success = computed(() => route.query.success === '1')
const error = computed(() => route.query.error === '1')

useSeoMeta({
  title: `Предприниматели — ${config.public.siteName}`,
  description: 'Истории предпринимателей, руководителей и основателей проектов.',
  ogTitle: `Предприниматели — ${config.public.siteName}`,
  ogDescription: 'Истории предпринимателей, руководителей и основателей проектов.',
  ogType: 'website',
})
</script>

<template>
  <EntrepreneursPage
    :page="page"
    :success="success"
    :error="error"
  />
</template>
