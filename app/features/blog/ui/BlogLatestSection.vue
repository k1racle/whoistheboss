<script setup lang="ts">
import type { BlogArticleSummary } from '@features/blog/model/blog.types'
import type { ArticleRowItem } from '@shared/types/article-row'
import ArticleRowCard from '@shared/ui/cards/ArticleRowCard.vue'
import SectionTitle from '@shared/ui/page/SectionTitle.vue'

const props = defineProps<{
  title: string
  description: string
  articles: BlogArticleSummary[]
}>()

const articleRows = computed<ArticleRowItem[]>(() => props.articles.map(article => ({
  id: article.id,
  slug: article.slug,
  title: article.title,
  subtitle: article.subtitle,
  entrepreneurName: article.entrepreneur?.name ?? null,
  coverImage: article.coverImage,
})))
</script>

<template>
  <section id="latest-news" class="bg-bg py-[90px] lg:py-[130px]">
    <div class="mx-auto w-full max-w-[1920px] px-5 sm:px-6 lg:px-10">
      <div class="mb-16 grid grid-cols-1 gap-6 md:mb-20 lg:mb-40 lg:grid-cols-[minmax(0,1fr)_minmax(0,3fr)] lg:gap-10">
        <SectionTitle class="w-[min(430px,100%)]">
          {{ title }}
        </SectionTitle>
        <p class="m-0 w-[min(100%,620px)] font-sans text-base leading-4 text-text">
          {{ description }}
        </p>
      </div>

      <ul v-if="articleRows.length" class="grid gap-5">
        <ArticleRowCard
          v-for="article in articleRows"
          :key="article.id"
          :article="article"
        />
      </ul>

      <p
        v-else
        class="min-h-[300px] font-sans text-base uppercase leading-4 text-text/60"
      >
        Опубликованные новости скоро появятся.
      </p>
    </div>
  </section>
</template>
