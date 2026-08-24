<script setup lang="ts">
import type { CompaniesPageData } from '@features/companies/model/companies-page.types'
import CompaniesPage from '@features/companies/ui/CompaniesPage.vue'

const route = useRoute()
const config = useRuntimeConfig()

const fallbackPage: CompaniesPageData = {
  heroTitle: 'ГЛАВНЫЕ\nКОМПАНИИ',
  aboutTitle: 'О ПРОЕКТЕ',
  aboutText: 'Мы рассказываем личные истории предпринимателей через их дело.',
  companies: [],
  bannerImage: '',
  bannerMobileImage: '',
  bannerLink: '/',
  sectionOrder: ['hero', 'about', 'catalog', 'cta', 'banner'],
  sectionVisibility: {},
}

const { data, error: pageError } = await useAsyncData('companies-page', async () =>
  await $fetch<CompaniesPageData>('/api/companies-page'))

if (pageError.value) {
  throw createError({
    statusCode: pageError.value.statusCode || 503,
    statusMessage: 'Companies page is unavailable',
  })
}

const page = computed(() => data.value ?? fallbackPage)
const success = computed(() => route.query.success === '1')
const error = computed(() => route.query.error === '1')

useSeoMeta({
  title: `Компании — ${config.public.siteName}`,
  description: 'Компании, рестораны, магазины и другие проекты героев «Маршрут Построен».',
  ogTitle: `Компании — ${config.public.siteName}`,
  ogDescription: 'Компании, рестораны, магазины и другие проекты героев «Маршрут Построен».',
})
</script>

<template>
  <CompaniesPage
    :page="page"
    :success="success"
    :error="error"
  />
</template>
