<script setup lang="ts">
import type { BlogPageData } from '@features/blog/model/blog.types'
import BlogPage from '@features/blog/ui/BlogPage.vue'

const route = useRoute()
const config = useRuntimeConfig()

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

const { data } = await useAsyncData('blog-page', async () => {
  try {
    return await $fetch<BlogPageData>('/api/blog-page')
  }
  catch {
    return fallbackPage
  }
})

const page = computed(() => data.value ?? fallbackPage)
const success = computed(() => route.query.success === '1')
const error = computed(() => route.query.error === '1')

useSeoMeta({
  title: `Блог — ${config.public.siteName}`,
  description: 'Статьи, новости и заметки о предпринимателях, компаниях и бизнесе проекта.',
  ogTitle: `Блог — ${config.public.siteName}`,
  ogDescription: 'Статьи, новости и заметки о предпринимателях, компаниях и бизнесе проекта.',
  ogType: 'website',
})
</script>

<template>
  <BlogPage
    :page="page"
    :success="success"
    :error="error"
  />
</template>
