<script setup lang="ts">
import type { LandingArticle } from '@features/landing/model/landing.data'
import { ROUTES } from '@shared/navigation'

defineProps<{
  article: LandingArticle
}>()
</script>

<template>
  <li class="group relative">
    <NuxtLink
      :to="ROUTES.ARTICLE(article.slug)"
      class="grid grid-cols-1 gap-2 px-4 py-6 transition-colors duration-300 group-hover:bg-accent group-hover:text-text-on-accent sm:px-6 md:grid-cols-[1fr_3fr] md:gap-x-6 lg:px-10"
      :aria-label="`${article.title}, ${article.entrepreneurName ?? ''}`"
    >
      <div>
        <span class="font-sans text-xs font-bold uppercase tracking-[0.14em] text-text/70 transition-colors duration-300 group-hover:text-text-on-accent md:text-sm">
          {{ article.entrepreneurName || 'Кто здесь главный?' }}
        </span>
      </div>

      <div class="flex items-start justify-between gap-4">
        <h3 class="font-sans text-base font-bold uppercase leading-tight tracking-tight text-text transition-colors duration-300 group-hover:text-text-on-accent md:text-xl">
          {{ article.title }}
        </h3>
        <span
          class="shrink-0 font-sans text-base leading-none text-text-muted transition-colors duration-300 group-hover:text-text-on-accent md:text-lg"
          aria-hidden="true"
        >
          [ ↗ ]
        </span>
      </div>

      <div v-if="article.subtitle" class="border-t border-border-strong transition-colors duration-300 group-hover:border-text-on-accent/30 md:col-span-2" />

      <div v-if="article.subtitle" class="pt-2 md:col-start-2">
        <p class="max-w-xl font-sans text-xs uppercase leading-5 text-text-muted transition-colors duration-300 group-hover:text-text-on-accent">
          {{ article.subtitle }}
        </p>
      </div>
    </NuxtLink>
  </li>
</template>
