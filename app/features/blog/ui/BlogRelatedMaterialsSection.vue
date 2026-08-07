<script setup lang="ts">
import type { BlogArticleRelatedMaterial } from '@features/blog/model/blog.types'
import LandingSlider from '@features/landing/ui/slider/LandingSlider.vue'
import BlogRelatedMaterialCard from '@features/blog/ui/BlogRelatedMaterialCard.vue'
import SectionTitle from '@shared/ui/page/SectionTitle.vue'

withDefaults(defineProps<{
  title?: string | null
  materials: BlogArticleRelatedMaterial[]
}>(), {
  title: 'МАТЕРИАЛЫ ПО ТЕМЕ',
})
</script>

<template>
  <section class="bg-bg py-20 lg:py-32">
    <div class="mx-auto w-full max-w-[1920px] px-5 sm:px-6 lg:px-10">
      <SectionTitle class="mb-12 text-center lg:mb-[86px]">
        {{ title || 'МАТЕРИАЛЫ ПО ТЕМЕ' }}
      </SectionTitle>

      <LandingSlider :items-count="materials.length" aria-label="Материалы по теме">
        <BlogRelatedMaterialCard
          v-for="material in materials"
          :key="`${material.type}-${material.slug}`"
          :material="material"
          class="min-w-[82%] shrink-0 snap-center sm:min-w-[420px]"
        />
      </LandingSlider>

      <div class="hidden grid-cols-3 gap-5 md:grid lg:gap-8">
        <BlogRelatedMaterialCard
          v-for="material in materials"
          :key="`${material.type}-${material.slug}`"
          :material="material"
        />
      </div>
    </div>
  </section>
</template>
