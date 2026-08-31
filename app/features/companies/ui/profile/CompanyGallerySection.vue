<script setup lang="ts">
import ProfileGallerySection from '@shared/ui/gallery/ProfileGallerySection.vue'

defineProps<{
  images: string[]
  imageAltPrefix: string
}>()
</script>

<template>
  <ProfileGallerySection
    section-id="company-gallery"
    gallery-aria-label="Галерея компании"
    :images="images"
    :image-alt-prefix="imageAltPrefix"
  />
</template>
