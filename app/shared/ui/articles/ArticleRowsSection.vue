<script setup lang="ts">
import type { ArticleRowItem } from '@shared/types/article-row'
import ArticleRowCard from '@shared/ui/cards/ArticleRowCard.vue'
import SectionTitle from '@shared/ui/page/SectionTitle.vue'

withDefaults(defineProps<{
  title: string
  articles: ArticleRowItem[]
  emptyText?: string
}>(), {
  emptyText: 'Статьи появятся после первой публикации',
})
</script>

<template>
  <section class="bg-bg">
    <div class="mx-auto w-full max-w-[1920px]">
      <SectionTitle class="mb-10 px-4 pt-12 sm:px-6 lg:mb-12 lg:px-10 lg:pt-16">
        {{ title }}
      </SectionTitle>

      <div class="bg-bg md:border md:border-border-strong md:bg-surface">
        <ul
          v-if="articles.length"
          class="flex w-full max-w-[100vw] flex-col gap-4 overflow-hidden px-4 pb-4 sm:px-6 md:gap-5 md:overflow-visible md:px-0 md:pb-0 lg:grid"
        >
          <ArticleRowCard
            v-for="article in articles"
            :key="article.id"
            :article="article"
            class="w-full max-w-[100vw] min-w-0"
          />
        </ul>

        <p
          v-else
          class="px-4 py-12 font-sans text-sm uppercase tracking-[0.14em] text-text/55 sm:px-6 lg:px-10"
        >
          {{ emptyText }}
        </p>
      </div>
    </div>
  </section>
</template>
