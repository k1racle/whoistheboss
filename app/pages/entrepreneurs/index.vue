<script setup lang="ts">
import type { EntrepreneursPageData } from '@features/entrepreneurs/model/entrepreneur.types'
import EntrepreneursPage from '@features/entrepreneurs/ui/EntrepreneursPage.vue'

const route = useRoute()
const config = useRuntimeConfig()

const fallbackPage: EntrepreneursPageData = {
  heroTitle: 'Кто здесь\nглавный?',
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

const { data } = await useAsyncData('entrepreneurs-page', async () => {
  try {
    return await $fetch<EntrepreneursPageData>('/api/entrepreneurs-page')
  }
  catch {
    return fallbackPage
  }
})

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
