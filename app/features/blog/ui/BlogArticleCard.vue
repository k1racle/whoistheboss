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
    class="group grid gap-5 border border-border-strong bg-surface p-5 transition-transform duration-300 hover:-translate-y-1 sm:p-6 lg:grid-cols-[minmax(0,1fr)_180px]"
  >
    <div class="flex flex-col gap-4">
      <div class="flex flex-wrap gap-x-4 gap-y-2 font-sans text-xs uppercase leading-4 text-text-muted sm:text-sm">
        <span>{{ article.entrepreneur?.name || 'Редакция проекта' }}</span>
        <span v-if="article.category">{{ article.category }}</span>
        <span v-if="article.publishedAt">{{ formatRussianDate(article.publishedAt) }}</span>
      </div>

      <div class="space-y-3">
        <h3 class="font-display text-[clamp(2rem,5vw,3rem)] font-black uppercase leading-[0.94] tracking-[-0.03em] text-text transition-colors group-hover:text-accent">
          {{ article.title }}
        </h3>
        <p
          v-if="article.subtitle"
          class="max-w-[44rem] font-sans text-base leading-7 text-text/80 sm:text-lg"
        >
          {{ article.subtitle }}
        </p>
      </div>

      <div class="inline-flex items-center gap-3 font-sans text-sm uppercase leading-4 text-accent sm:text-base">
        <span>Читать материал</span>
        <span aria-hidden="true">[ ↗ ]</span>
      </div>
    </div>

    <div class="overflow-hidden bg-bg">
      <img
        :src="article.coverImage || article.entrepreneur?.photo || '/images/placeholder.svg'"
        :alt="article.title"
        class="h-full min-h-[180px] w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
      >
    </div>
  </NuxtLink>
</template>
