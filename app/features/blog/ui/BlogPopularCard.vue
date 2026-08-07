<script setup lang="ts">
import type { BlogArticleSummary } from '@features/blog/model/blog.types'
import { ROUTES } from '@shared/navigation'
import ArrowMark from '@shared/ui/icons/ArrowMark.vue'

defineProps<{
  article: BlogArticleSummary
  isRed: boolean
}>()
</script>

<template>
  <NuxtLink
    :to="ROUTES.ARTICLE(article.slug)"
    class="group relative flex aspect-[1.29] min-w-0 overflow-hidden border p-6 text-text no-underline transition-colors duration-200 sm:min-h-[280px] lg:p-8"
    :class="isRed
      ? 'border-accent bg-accent text-text-on-accent hover:bg-surface hover:text-text focus-visible:bg-surface focus-visible:text-text'
      : 'border-text/10 bg-surface hover:border-text hover:bg-accent hover:text-text-on-accent focus-visible:border-text focus-visible:bg-accent focus-visible:text-text-on-accent'"
    :aria-label="article.title"
  >
    <span class="absolute right-5 top-5 flex items-center justify-center text-current" aria-hidden="true">
      <ArrowMark />
    </span>

    <span class="flex w-[min(76%,520px)] flex-col self-center">
      <strong class="font-sans text-[27px] font-bold uppercase leading-[27px] tracking-[-1.25px] md:text-[32px] md:leading-8">
        {{ article.title }}
      </strong>
      <span
        v-if="article.subtitle"
        class="mt-[18px] font-sans text-base font-normal leading-4"
      >
        {{ article.subtitle }}
      </span>
    </span>
  </NuxtLink>
</template>
