<script setup lang="ts">
import type { BlogPageData } from '@features/blog/model/blog.types'
import BlogPage from '@features/blog/ui/BlogPage.vue'
import PageBannerSection from '@shared/ui/page/PageBannerSection.vue'
import { useSiteBanner } from '@shared/ui/page/useSiteBanner'

const route = useRoute()
const config = useRuntimeConfig()
const city = computed(() => typeof route.params.city === 'string' ? route.params.city : undefined)

const fallbackPage: BlogPageData = {
  heroTitle: 'Главные\nновости',
  popularTitle: 'Популярное',
  latestTitle: 'Последние новости',
  latestDescription: 'Новости проекта, истории предпринимателей и материалы о компаниях.',
  relatedTitle: 'Читайте также',
  mainCards: [
    { title: 'Новый материал', text: '', image: '', url: '' },
    { title: 'Еще один выпуск', text: '', image: '', url: '' },
  ],
  featuredArticles: [],
  latestArticles: [],
  relatedEntrepreneurs: [],
  relatedCompanies: [],
  sectionOrder: ['hero', 'popular', 'mainNews', 'latestNews', 'related', 'cta'],
  sectionVisibility: {},
}

const { data, error: pageError } = await useAsyncData(`blog-page-${city.value || 'all'}`, async () =>
  await $fetch<BlogPageData>('/api/blog-page', { query: { city: city.value } }))

if (pageError.value) {
  throw createError({
    statusCode: pageError.value.statusCode || 503,
    statusMessage: 'Blog page is unavailable',
  })
}

const page = computed(() => data.value ?? fallbackPage)
const success = computed(() => route.query.success === '1')
const error = computed(() => route.query.error === '1')
const { banner, isEnabled: isBannerEnabled } = useSiteBanner()

useSeoMeta({
  title: `Блог — ${config.public.siteName}`,
  description: 'Статьи, новости и заметки о предпринимателях, компаниях и бизнесе проекта.',
  ogTitle: `Блог — ${config.public.siteName}`,
  ogDescription: 'Статьи, новости и заметки о предпринимателях, компаниях и бизнесе проекта.',
  ogType: 'website',
})
</script>

<template>
  <div class="flex flex-col">
    <BlogPage
      :page="page"
      :success="success"
      :error="error"
    />
    <PageBannerSection
      v-if="isBannerEnabled('/blog')"
      :desktop-image="banner.image"
      :mobile-image="banner.mobileImage"
      :href="banner.link"
    />
  </div>
</template>
