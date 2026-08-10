<script setup lang="ts">
import type { ArticleRowItem } from '@shared/types/article-row'
import { protectPrepositions } from '@shared/lib/typography'
import ArticleRowCard from '@shared/ui/cards/ArticleRowCard.vue'
import SectionTitle from '@shared/ui/page/SectionTitle.vue'

const props = withDefaults(defineProps<{
  title: string
  articles: ArticleRowItem[]
  emptyText?: string
  hasMore?: boolean
  loading?: boolean
}>(), {
  emptyText: 'Статьи появятся после первой публикации',
  hasMore: false,
  loading: false,
})

const emit = defineEmits<{
  loadMore: []
}>()

const protectedTitle = computed(() => protectPrepositions(props.title))
</script>

<template>
  <section class="bg-bg">
    <div class="mx-auto w-full max-w-[1920px]">
      <SectionTitle class="mb-10 px-4 pt-12 sm:px-6 lg:mb-12 lg:px-10 lg:pt-16">
        {{ protectedTitle }}
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

        <div v-if="hasMore" class="flex justify-center px-4 py-8 sm:px-6 lg:px-10">
          <button
            type="button"
            class="inline-flex min-h-11 items-center justify-center bg-surface px-4 py-2.5 font-sans text-sm font-normal uppercase leading-4 text-text transition-colors hover:bg-accent hover:text-text-on-accent disabled:cursor-wait disabled:opacity-60"
            :disabled="loading"
            @click="emit('loadMore')"
          >
            {{ loading ? 'Загрузка…' : 'Показать ещё' }}
          </button>
        </div>
      </div>
    </div>
  </section>
</template>
