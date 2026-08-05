<script setup lang="ts">
import type { BlogArticleSummary } from '@features/blog/model/blog.types'
import type { ArticleRowItem } from '@shared/types/article-row'
import ArticleRowCard from '@shared/ui/cards/ArticleRowCard.vue'

const props = defineProps<{
  article: BlogArticleSummary
}>()

const articleRow = computed<ArticleRowItem>(() => ({
  id: props.article.id,
  slug: props.article.slug,
  title: props.article.title,
  subtitle: props.article.subtitle,
  entrepreneurName: props.article.entrepreneur?.name ?? null,
  coverImage: props.article.coverImage,
}))
</script>

<template>
  <ArticleRowCard :article="articleRow" />
</template>
