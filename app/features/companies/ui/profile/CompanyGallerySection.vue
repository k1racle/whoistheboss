<script setup lang="ts">
import PinnedHorizontalTrackSection from '@shared/ui/scroll/PinnedHorizontalTrackSection.vue'

defineProps<{
  images: string[]
  imageAltPrefix: string
}>()
</script>

<template>
  <PinnedHorizontalTrackSection
    section-id="company-gallery"
    title="ГАЛЕРЕЯ"
    aria-label="Галерея компании"
  >
    <figure
      v-for="(image, index) in images"
      :key="`${image}-${index}`"
      class="h-[28rem] min-w-[85vw] shrink-0 overflow-hidden border border-border bg-surface md:h-[42rem] md:w-[min(440px,88vw)] md:min-w-0"
      :class="{ 'md:mt-20': index % 2 === 0 }"
    >
      <NuxtImg
        :src="image"
        :alt="`${imageAltPrefix} — фото ${index + 1}`"
        sizes="320:85vw 480:85vw sm:85vw md:440px"
        format="webp"
        class="h-full w-full object-cover"
        loading="lazy"
        decoding="async"
      />
    </figure>
  </PinnedHorizontalTrackSection>
</template>
