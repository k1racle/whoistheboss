<script setup lang="ts">
import PageBannerSection from '@shared/ui/page/PageBannerSection.vue'

defineProps<{
  image: string
  mobileImage?: string
  link: string
}>()
</script>

<template>
  <PageBannerSection
    :desktop-image="image"
    :mobile-image="mobileImage"
    :href="link"
  />
</template>
