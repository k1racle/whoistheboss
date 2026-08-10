<script setup lang="ts">
import type { BlogRelatedEntrepreneur } from '@features/blog/model/blog.types'
import { ROUTES } from '@shared/navigation'

const props = defineProps<{
  entrepreneur: BlogRelatedEntrepreneur
}>()

const imageSrc = computed(() => props.entrepreneur.photo || '/images/placeholder.svg')
const hoverImageSrc = computed(() => props.entrepreneur.hoverPhoto || props.entrepreneur.photo || '/images/placeholder.svg')
</script>

<template>
  <NuxtLink
    :to="ROUTES.ENTREPRENEUR(entrepreneur.slug)"
    class="group relative grid aspect-square min-w-0 overflow-hidden bg-accent text-text-on-accent no-underline"
    :aria-label="`${entrepreneur.name}, ${entrepreneur.title}`"
  >
    <div class="col-start-1 row-start-1 bg-accent" aria-hidden="true" />
    <NuxtImg
      :src="imageSrc"
      :alt="entrepreneur.name"
      class="col-start-1 row-start-1 h-full w-full object-cover transition-opacity duration-500 group-hover:opacity-0 group-focus-visible:opacity-0"
      loading="lazy"
    />
    <NuxtImg
      :src="hoverImageSrc"
      alt=""
      class="col-start-1 row-start-1 h-full w-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-focus-visible:opacity-100"
      loading="lazy"
    />
  </NuxtLink>
</template>
