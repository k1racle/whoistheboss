<script setup lang="ts">
import LandingPage from '@features/landing/ui/LandingPage.vue'

const config = useRuntimeConfig()

useSeoMeta({
  title: config.public.siteName,
  description: config.public.siteDescription,
  ogTitle: config.public.siteName,
  ogDescription: config.public.siteDescription,
  ogType: 'website',
  ogUrl: config.public.siteUrl,
})
</script>

<template>
  <LandingPage />
</template>
