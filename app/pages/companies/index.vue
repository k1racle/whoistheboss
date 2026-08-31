<script setup lang="ts">
import type { CompaniesPageData } from '@features/companies/model/companies-page.types'
import CompaniesPage from '@features/companies/ui/CompaniesPage.vue'
import { useManagedSeo } from '@shared/seo/use-managed-seo'
import { usePageSeo } from '@shared/seo/use-page-seo'

const route = useRoute()
const config = useRuntimeConfig()
const city = computed(() => typeof route.params.city === 'string' ? route.params.city : undefined)

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

const { data, error: pageError } = await useAsyncData(`companies-page-${city.value || 'all'}`, async () =>
  await $fetch<CompaniesPageData>('/api/companies-page', { query: { city: city.value } }))

if (pageError.value) {
  throw createError({
    statusCode: pageError.value.statusCode || 503,
    statusMessage: 'Companies page is unavailable',
  })
}

const page = computed(() => data.value ?? fallbackPage)
const success = computed(() => route.query.success === '1')
const error = computed(() => route.query.error === '1')

const seo = await usePageSeo('companies', {
  title: `Бизнес — ${config.public.siteName}`,
  description: 'Компании, рестораны, магазины и другие проекты героев «Маршрут Построен»: история создания, команда и ключевые факты.',
  image: '',
})

useManagedSeo(seo.value)
</script>

<template>
  <CompaniesPage
    :page="page"
    :success="success"
    :error="error"
  />
</template>
