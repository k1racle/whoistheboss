<script setup lang="ts">
import type { BlogArticleDetailResponse } from '@features/blog/model/blog.types'
import BlogDetailPage from '@features/blog/ui/BlogDetailPage.vue'
import { SEO_SITE_NAME } from '@shared/seo/brand'
import { buildArticleSeoDescription, buildArticleSeoTitle } from '@shared/seo/content'
import { useManagedSeo } from '@shared/seo/use-managed-seo'

const route = useRoute()
const config = useRuntimeConfig()
const slug = computed(() => String(route.params.slug))
const city = computed(() => typeof route.params.city === 'string' ? route.params.city : undefined)

const { data, error } = await useAsyncData(`blog-article-${city.value || 'all'}-${slug.value}`, async () =>
  await $fetch<BlogArticleDetailResponse>(`/api/blog/${slug.value}`, { query: { city: city.value } })
)

if (error.value || !data.value) {
  throw createError({
    statusCode: error.value?.statusCode || 404,
    statusMessage: error.value?.statusMessage || 'Article not found',
  })
}

const article = data.value.article
const title = buildArticleSeoTitle(article)
const description = buildArticleSeoDescription(article)

const seo = useManagedSeo({ title, description, image: article.coverImage, type: 'article' })
useSeoMeta({
  articlePublishedTime: article.publishedAt || article.createdAt,
  articleModifiedTime: article.updatedAt,
})

useSchemaOrg([
  defineArticle({
    headline: article.title,
    description: seo.description,
    image: seo.imageUrl,
    url: seo.canonicalUrl,
    datePublished: article.publishedAt || article.createdAt,
    dateModified: article.updatedAt,
    author: article.entrepreneur
      ? definePerson({
          name: article.entrepreneur.name,
          url: `/entrepreneurs/${article.entrepreneur.slug}`,
          image: article.entrepreneur.photo || undefined,
        })
      : defineOrganization({
          name: SEO_SITE_NAME,
          url: config.public.siteUrl,
        }),
    publisher: defineOrganization({
      name: SEO_SITE_NAME,
      url: config.public.siteUrl,
      logo: '/favicon/web-app-manifest-512x512.png',
    }),
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
