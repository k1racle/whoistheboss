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
      class="pinned-portrait-item overflow-hidden border border-border bg-surface"
      :class="{ 'md:mt-20': index % 2 === 0 }"
    >
      <NuxtImg
        :src="image"
        :alt="`${imageAltPrefix} — фото ${index + 1}`"
        sizes="320:260px 480:70vw md:440px"
        format="webp"
        class="h-full w-full object-cover"
        loading="lazy"
        decoding="async"
      />
    </figure>
  </PinnedHorizontalTrackSection>
</template>
