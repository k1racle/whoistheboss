<script setup lang="ts">
import LandingHeroSection from '@features/landing/ui/sections/LandingHeroSection.vue'

defineProps<{
  title: string
}>()
</script>

<template>
  <LandingHeroSection :title="title" />
</template>
