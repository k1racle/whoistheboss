<script setup lang="ts">
import type { LandingArticle, LandingLatestArticles } from '@features/landing/model/landing.data'
import type { ArticleRowItem } from '@shared/types/article-row'
import ArticleRowsSection from '@shared/ui/articles/ArticleRowsSection.vue'

const props = defineProps<{
  title: string
  description: string
  initialData: LandingLatestArticles
}>()

interface LatestArticlesResponse {
  articles: LandingArticle[]
  hasMore: boolean
}

const articles = ref<LandingArticle[]>([...props.initialData.articles])
const hasMore = ref(props.initialData.hasMore)
const loading = ref(false)
const articleRows = computed<ArticleRowItem[]>(() => articles.value.map(article => ({
  id: article.id,
  slug: article.slug,
  title: article.title,
  subtitle: article.subtitle,
  entrepreneurName: article.entrepreneurName,
  coverImage: article.coverImage,
})))

async function loadMore() {
  if (loading.value || !hasMore.value) return

  loading.value = true

  try {
    const response = await $fetch<LatestArticlesResponse>('/api/articles/latest', {
      query: { limit: props.initialData.pageSize, skip: articles.value.length },
    })

    articles.value.push(...response.articles)
    hasMore.value = response.hasMore
  }
  finally {
    loading.value = false
  }
}
</script>

<template>
  <ArticleRowsSection
    :title="title"
    :description="description"
    :articles="articleRows"
    :has-more="hasMore"
    :loading="loading"
    @load-more="loadMore"
  />
</template>
