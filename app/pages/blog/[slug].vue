<script setup lang="ts">
import type { BlogArticleDetailResponse } from '@features/blog/model/blog.types'
import BlogDetailPage from '@features/blog/ui/BlogDetailPage.vue'

const route = useRoute()
const config = useRuntimeConfig()
const slug = computed(() => String(route.params.slug))

const { data, error } = await useAsyncData(`blog-article-${slug.value}`, async () =>
  await $fetch<BlogArticleDetailResponse>(`/api/blog/${slug.value}`)
)

if (error.value || !data.value) {
  throw createError({ statusCode: 404, statusMessage: 'Article not found' })
}

useSeoMeta({
  title: () => `${data.value?.article.metaTitle || data.value?.article.title || 'Статья'} — ${config.public.siteName}`,
  description: () => data.value?.article.metaDesc || data.value?.article.subtitle || config.public.siteDescription,
  ogTitle: () => `${data.value?.article.metaTitle || data.value?.article.title || 'Статья'} — ${config.public.siteName}`,
  ogDescription: () => data.value?.article.metaDesc || data.value?.article.subtitle || config.public.siteDescription,
  ogType: 'article',
})
</script>

<template>
  <BlogDetailPage
    v-if="data"
    v-bind="data"
  />
</template>
