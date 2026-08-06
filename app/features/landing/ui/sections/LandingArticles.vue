<script setup lang="ts">
import type { LandingArticle } from '@features/landing/model/landing.data'
import type { ArticleRowItem } from '@shared/types/article-row'
import ArticleRowsSection from '@shared/ui/articles/ArticleRowsSection.vue'

defineProps<{
  title: string
}>()

const { data } = await useFetch<{ articles: LandingArticle[] }>('/api/articles/latest')

const articles = computed(() => data.value?.articles ?? [])
const articleRows = computed<ArticleRowItem[]>(() => articles.value.map(article => ({
  id: article.id,
  slug: article.slug,
  title: article.title,
  subtitle: article.subtitle,
  entrepreneurName: article.entrepreneurName,
  coverImage: article.coverImage,
})))
</script>

<template>
  <ArticleRowsSection
    :title="title"
    :articles="articleRows"
  />
</template>
