<script setup lang="ts">
import type { BlogArticleSummary } from '@features/blog/model/blog.types'
import BlogPopularCard from '@features/blog/ui/BlogPopularCard.vue'
import SectionTitle from '@shared/ui/page/SectionTitle.vue'

defineProps<{
  title: string
  articles: BlogArticleSummary[]
}>()
</script>

<template>
  <section id="popular" class="bg-bg py-[60px] lg:py-[72px] lg:pb-[130px]">
    <div class="mx-auto w-full max-w-[1920px] px-5 sm:px-6 lg:px-10">
      <SectionTitle class="mb-16 lg:mb-[120px]">
        {{ title }}
      </SectionTitle>

      <div
        v-if="articles.length"
        class="grid grid-cols-1 gap-5 lg:grid-cols-3 lg:gap-8"
      >
        <BlogPopularCard
          v-for="(article, index) in articles"
          :key="article.id"
          :article="article"
          :is-red="index === 2 || index === 3"
        />
      </div>

      <p
        v-else
        class="min-h-[300px] font-sans text-base uppercase leading-4 text-text/60"
      >
        Записи блога скоро появятся.
      </p>
    </div>
  </section>
</template>
