<script setup lang="ts">
import type { LandingArticle } from '@features/landing/model/landing.data'
import type { ArticleRowItem } from '@shared/types/article-row'
import ArticleRowsSection from '@shared/ui/articles/ArticleRowsSection.vue'

defineProps<{
  title: string
}>()

interface LatestArticlesResponse {
  articles: LandingArticle[]
  hasMore: boolean
}

const PAGE_SIZE = 6

const { data } = await useFetch<LatestArticlesResponse>('/api/articles/latest', {
  query: { limit: PAGE_SIZE, skip: 0 },
})

const articles = ref<LandingArticle[]>(data.value?.articles ?? [])
const hasMore = ref(data.value?.hasMore ?? false)
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
      query: { limit: PAGE_SIZE, skip: articles.value.length },
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
    :articles="articleRows"
    :has-more="hasMore"
    :loading="loading"
    @load-more="loadMore"
  />
</template>
