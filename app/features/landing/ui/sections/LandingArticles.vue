<script setup lang="ts">
import type { LandingArticle } from '@features/landing/model/landing.data'
import LandingArticleCard from '@features/landing/ui/LandingArticleCard.vue'

defineProps<{
  title: string
}>()

const { data } = await useFetch<{ articles: LandingArticle[] }>('/api/articles/latest')

const articles = computed(() => data.value?.articles ?? [])
</script>

<template>
  <section class="bg-bg">
    <div class="mx-auto w-full max-w-[1920px]">
      <h2 class="mb-10 px-4 pt-12 font-display text-[clamp(3rem,8vw,6rem)] font-black uppercase leading-[0.88]  tracking-[-3%] text-text sm:px-6 lg:mb-12 lg:px-10 lg:pt-16">
        {{ title }}
      </h2>

      <div class="border border-border-strong bg-surface">
        <ul
          v-if="articles.length"
          class="flex flex-col"
        >
          <LandingArticleCard
            v-for="article in articles"
            :key="article.id"
            :article="article"
          />
        </ul>

        <p
          v-else
          class="px-4 py-12 font-sans text-sm uppercase tracking-[0.14em] text-text/55 sm:px-6 lg:px-10"
        >
          Статьи появятся после первой публикации
        </p>
      </div>
    </div>
  </section>
</template>
