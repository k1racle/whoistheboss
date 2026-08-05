<script setup lang="ts">
import type { BlogArticleSummary } from '@features/blog/model/blog.types'
import { formatRussianDate } from '@shared/lib/date'
import { ROUTES } from '@shared/navigation'

defineProps<{
  article: BlogArticleSummary
}>()
</script>

<template>
  <NuxtLink
    :to="ROUTES.ARTICLE(article.slug)"
    class="group grid gap-5 overflow-hidden rounded-[28px] border border-black/10 bg-surface p-6 shadow-[0_24px_64px_rgba(7,7,7,0.06)] transition-transform duration-300 hover:-translate-y-1 lg:grid-cols-[220px_minmax(0,1fr)_180px]"
  >
    <div class="flex flex-wrap items-start gap-3 text-xs font-medium uppercase tracking-[0.14em] text-text/42 lg:flex-col lg:gap-2">
      <span>{{ article.entrepreneur?.name || 'Редакция проекта' }}</span>
      <span v-if="article.category">{{ article.category }}</span>
      <span v-if="article.publishedAt">{{ formatRussianDate(article.publishedAt) }}</span>
    </div>

    <div class="flex flex-col justify-between">
      <div>
        <h3 class="text-2xl font-bold leading-tight tracking-tight text-text transition-colors group-hover:text-accent sm:text-[2rem]">
          {{ article.title }}
        </h3>
        <p
          v-if="article.subtitle"
          class="mt-3 max-w-[46rem] text-base leading-7 text-text/74 sm:text-lg"
        >
          {{ article.subtitle }}
        </p>
      </div>

      <div class="mt-5 inline-flex items-center gap-3 text-sm font-semibold text-accent">
        <span>Читать материал</span>
        <svg
          class="h-4 w-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M7 17 17 7M9 7h8v8"
          />
        </svg>
      </div>
    </div>

    <div class="overflow-hidden rounded-[22px] bg-[#f1f1ec]">
      <img
        :src="article.coverImage || article.entrepreneur?.photo || '/images/placeholder.svg'"
        :alt="article.title"
        class="h-full min-h-[180px] w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
      >
    </div>
  </NuxtLink>
</template>
