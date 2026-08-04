<script setup lang="ts">
import type { LandingArticle } from '@features/landing/model/landing.data'
import { ROUTES } from '@shared/navigation'

defineProps<{
  article: LandingArticle
}>()
</script>

<template>
  <li class="group relative hover:bg-text/[0.04] after:absolute after:inset-x-2 after:bottom-0 after:h-[2.5px] after:bg-border-strong after:content-[''] last:after:hidden md:after:inset-x-4">
    <NuxtLink
      :to="ROUTES.ARTICLE(article.slug)"
      class="flex flex-col gap-2 px-2 py-6 md:flex-row md:gap-6 md:px-4"
      :aria-label="`${article.title}, ${article.entrepreneurName ?? ''}`"
    >
      <div class="md:w-1/4">
        <span class="font-sans text-xs font-bold uppercase tracking-[0.14em] text-text/70 md:text-sm">
          {{ article.entrepreneurName || 'Кто здесь главный?' }}
        </span>
      </div>

      <div class="flex flex-col md:w-3/4">
        <div class="mb-2 flex items-start justify-between gap-4">
          <h3 class="font-sans text-base font-bold uppercase leading-tight tracking-tight text-text md:text-xl">
            {{ article.title }}
          </h3>
          <span
            class="shrink-0 font-sans text-base leading-none text-text-muted transition-colors group-hover:text-accent md:text-lg"
            aria-hidden="true"
          >
            [ ↗ ]
          </span>
        </div>

        <p
          v-if="article.subtitle"
          class="max-w-xl font-sans text-xs uppercase leading-5 text-text-muted"
        >
          {{ article.subtitle }}
        </p>
      </div>
    </NuxtLink>
  </li>
</template>
