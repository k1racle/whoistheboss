<script setup lang="ts">
import type { LandingArticle } from '@features/landing/model/landing.data'
import type { ArticleRowItem } from '@shared/types/article-row'
import ArticleRowCard from '@shared/ui/cards/ArticleRowCard.vue'

const props = defineProps<{
  article: LandingArticle
}>()

const articleRow = computed<ArticleRowItem>(() => ({
  id: props.article.id,
  slug: props.article.slug,
  title: props.article.title,
  subtitle: props.article.subtitle,
  entrepreneurName: props.article.entrepreneurName,
  coverImage: props.article.coverImage,
}))
</script>

<template>
  <ArticleRowCard :article="articleRow" />
</template>
