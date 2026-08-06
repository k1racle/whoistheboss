<script setup lang="ts">
import type { BlogArticleSummary } from '@features/blog/model/blog.types'
import LandingSlider from '@features/landing/ui/slider/LandingSlider.vue'
import EntrepreneurRelatedArticleCard from './EntrepreneurRelatedArticleCard.vue'

defineProps<{
  articles: BlogArticleSummary[]
}>()
</script>

<template>
  <section id="articles" class="bg-bg py-24 max-md:px-5 max-md:py-[72px]">
    <div class="mx-auto w-[min(calc(100%_-_80px),1920px)] max-md:w-full">
      <h2 class="mb-14 mt-0 text-center font-display text-[80px] font-black uppercase leading-[80px] tracking-[-0.03em] text-text max-md:mb-8 max-md:text-[clamp(48px,16vw,80px)] max-md:leading-[0.92]">
        Читайте также
      </h2>

      <LandingSlider :items-count="articles.length" aria-label="Читайте также">
        <EntrepreneurRelatedArticleCard
          v-for="article in articles"
          :key="article.id"
          :article="article"
          class="min-w-[70%] max-w-[70%] shrink-0 snap-center sm:min-w-[420px] sm:max-w-none"
        />
      </LandingSlider>

      <div class="hidden grid-cols-3 gap-5 md:grid">
        <EntrepreneurRelatedArticleCard
          v-for="article in articles"
          :key="article.id"
          :article="article"
        />
      </div>
    </div>
  </section>
</template>
