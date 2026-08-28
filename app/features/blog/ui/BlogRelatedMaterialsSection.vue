<script setup lang="ts">
import type { BlogArticleRelatedMaterial } from '@features/blog/model/blog.types'
import LandingSlider from '@features/landing/ui/slider/LandingSlider.vue'
import BlogRelatedMaterialCard from '@features/blog/ui/BlogRelatedMaterialCard.vue'
import { protectPrepositions } from '@shared/lib/typography'
import SectionTitle from '@shared/ui/page/SectionTitle.vue'

const props = withDefaults(defineProps<{
  title?: string | null
  materials: BlogArticleRelatedMaterial[]
}>(), {
  title: 'МАТЕРИАЛЫ ПО ТЕМЕ',
})

const protectedTitle = computed(() => protectPrepositions(props.title || 'МАТЕРИАЛЫ ПО ТЕМЕ'))
</script>

<template>
  <section class="bg-bg py-20 lg:py-32">
    <div class="mx-auto w-full max-w-[1920px] px-5 sm:px-6 lg:px-10">
      <SectionTitle class="mb-12 text-center lg:mb-[86px]">
        {{ protectedTitle }}
      </SectionTitle>

      <LandingSlider
        :items-count="materials.length"
        aria-label="Материалы по теме"
        desktop-track-class="md:grid md:grid-cols-3 md:gap-5 lg:gap-8"
      >
        <BlogRelatedMaterialCard
          v-for="material in materials"
          :key="`${material.type}-${material.slug}`"
          :material="material"
          class="aspect-square min-h-0 w-[82%] min-w-[82%] shrink-0 self-start snap-center sm:w-[420px] sm:min-w-[420px] md:w-auto md:min-w-0"
        />
      </LandingSlider>
    </div>
  </section>
</template>
