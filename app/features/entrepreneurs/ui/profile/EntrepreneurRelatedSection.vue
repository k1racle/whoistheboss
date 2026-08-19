<script setup lang="ts">
import type { BlogArticleSummary } from '@features/blog/model/blog.types'
import LandingSlider from '@features/landing/ui/slider/LandingSlider.vue'
import SectionTitle from '@shared/ui/page/SectionTitle.vue'
import EntrepreneurRelatedArticleCard from './EntrepreneurRelatedArticleCard.vue'

defineProps<{
  articles: BlogArticleSummary[]
}>()
</script>

<template>
  <section id="articles" class="bg-bg py-24 max-md:px-5 max-md:py-[72px]">
    <div class="mx-auto w-[min(calc(100%_-_80px),1920px)] max-md:w-full">
      <SectionTitle class="mb-14 mt-0 text-center max-md:mb-8">
        Читайте также
      </SectionTitle>

      <LandingSlider
        :items-count="articles.length"
        aria-label="Читайте также"
        desktop-track-class="md:grid md:grid-cols-3 md:gap-5"
      >
        <EntrepreneurRelatedArticleCard
          v-for="article in articles"
          :key="article.id"
          :article="article"
          class="min-w-[70%] max-w-[70%] shrink-0 snap-center sm:min-w-[420px] sm:max-w-none md:min-w-0"
        />
      </LandingSlider>
    </div>
  </section>
</template>
