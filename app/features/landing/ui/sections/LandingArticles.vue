<script setup lang="ts">
import type { LandingArticle } from '@features/landing/model/landing.data'
import LandingArticleCard from '@features/landing/ui/LandingArticleCard.vue'

const { data } = await useFetch<{ articles: LandingArticle[] }>('/api/articles/latest')

const articles = computed(() => data.value?.articles ?? [])
</script>

<template>
  <section class="bg-bg">
    <div class="mx-auto w-full max-w-[1920px] px-4 py-12 sm:px-6 lg:px-10 lg:py-16">
      <h2 class="mb-10 font-display text-[clamp(3rem,8vw,6rem)] font-black uppercase leading-[0.88]  tracking-[-3%] text-text lg:mb-12">
        Главные статьи
      </h2>

      <div class="border border-border-strong bg-surface px-4 py-2 sm:px-6 md:px-8 md:py-2 lg:px-12">
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
          class="px-2 py-12 font-sans text-sm uppercase tracking-[0.14em] text-text/55"
        >
          Статьи появятся после первой публикации
        </p>
      </div>
    </div>
  </section>
</template>
