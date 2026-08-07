<script setup lang="ts">
import type { BlogMainFeatureCard as BlogMainFeatureCardData } from '@features/blog/model/blog.types'
import BlogMainFeatureCard from '@features/blog/ui/BlogMainFeatureCard.vue'

defineProps<{
  cards: BlogMainFeatureCardData[]
}>()
</script>

<template>
  <section id="main-news" class="bg-bg py-[120px] lg:pb-[130px] lg:pt-[200px]">
    <div class="mx-auto w-full max-w-[1920px] px-5 sm:px-6 lg:px-10">
      <div class="grid gap-[72px] lg:gap-20">
        <BlogMainFeatureCard
          v-for="(card, index) in cards"
          :key="`${card.title}-${index}`"
          :card="card"
          :reverse="index % 2 === 1"
        />
      </div>
    </div>
  </section>
</template>
