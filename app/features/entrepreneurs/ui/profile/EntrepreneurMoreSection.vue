<script setup lang="ts">
import type { EntrepreneurMoreItem } from '@features/entrepreneurs/model/entrepreneur.types'
import PageMoreSection from '@shared/ui/page/PageMoreSection.vue'

defineProps<{
  items: EntrepreneurMoreItem[]
  image: string | null
  imageAlt: string
}>()
</script>

<template>
  <PageMoreSection
    :items="items"
    :image="image"
    :image-alt="imageAlt"
  />
</template>
