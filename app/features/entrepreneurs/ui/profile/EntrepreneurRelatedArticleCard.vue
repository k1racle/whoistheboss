<script setup lang="ts">
import type { BlogArticleSummary } from '@features/blog/model/blog.types'

defineProps<{
  article: BlogArticleSummary
}>()
</script>

<template>
  <NuxtLink :to="`/blog/${article.slug}`" class="flex min-h-full min-w-0 flex-col overflow-hidden bg-surface text-text no-underline transition-colors duration-200 hover:bg-accent hover:text-text-on-accent focus-visible:bg-accent focus-visible:text-text-on-accent">
    <NuxtImg
      :src="article.coverImage || '/images/placeholder.svg'"
      :alt="article.title"
      sizes="320:70vw 480:70vw sm:420px md:33vw 2000:614px"
      format="webp"
      loading="lazy"
      decoding="async"
      class="aspect-[4/3] w-full object-cover"
    />
    <div class="flex min-w-0 flex-1 flex-col gap-3 p-5">
      <span v-if="article.category" class="font-sans text-xs uppercase leading-[14px]">
        {{ article.category }}
      </span>
      <h3 class="m-0 min-w-0 max-w-full font-sans text-[22px] font-bold uppercase leading-[22px] [overflow-wrap:anywhere] hyphens-auto">
        {{ article.title }}
      </h3>
      <p v-if="article.subtitle" class="mt-auto min-w-0 max-w-full font-sans text-sm leading-[18px] [overflow-wrap:anywhere] hyphens-auto">
        {{ article.subtitle }}
      </p>
    </div>
  </NuxtLink>
</template>
