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

const article = data.value.article
const title = `${article.metaTitle || article.title} — ${config.public.siteName}`
const description = article.metaDesc || article.subtitle || config.public.siteDescription

useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description,
  ogType: 'article',
  ogImage: article.coverImage || undefined,
  articlePublishedTime: article.publishedAt || article.createdAt,
  articleModifiedTime: article.updatedAt,
  twitterCard: article.coverImage ? 'summary_large_image' : 'summary',
  twitterImage: article.coverImage || undefined,
})

useSchemaOrg([
  defineArticle({
    headline: article.title,
    description,
    image: article.coverImage || undefined,
    datePublished: article.publishedAt || article.createdAt,
    dateModified: article.updatedAt,
    author: article.entrepreneur
      ? definePerson({
          name: article.entrepreneur.name,
          url: `/entrepreneurs/${article.entrepreneur.slug}`,
          image: article.entrepreneur.photo || undefined,
        })
      : undefined,
  }),
  defineBreadcrumb({
    itemListElement: [
      { name: 'Главная', item: '/' },
      { name: 'Блог', item: '/blog' },
      { name: article.title },
    ],
  }),
])
</script>

<template>
  <BlogDetailPage
    v-if="data"
    v-bind="data"
  />
</template>
