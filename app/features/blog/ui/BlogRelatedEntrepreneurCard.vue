<script setup lang="ts">
import type { BlogRelatedEntrepreneur } from '@features/blog/model/blog.types'
import { ROUTES } from '@shared/navigation'
import ArrowMark from '@shared/ui/icons/ArrowMark.vue'

const props = withDefaults(defineProps<{
  entrepreneur: BlogRelatedEntrepreneur
  showText?: boolean
}>(), {
  showText: true,
})

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
    <img
      :src="imageSrc"
      :alt="entrepreneur.name"
      class="col-start-1 row-start-1 h-full w-full object-cover transition-opacity duration-500 group-hover:opacity-0 group-focus-visible:opacity-0"
      loading="lazy"
    >
    <img
      :src="hoverImageSrc"
      alt=""
      class="col-start-1 row-start-1 h-full w-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-focus-visible:opacity-100"
      loading="lazy"
    >

    <template v-if="showText">
      <span class="absolute left-4 top-4 z-[2] max-w-[70%] bg-accent px-2 py-1 font-sans text-[25px] font-normal uppercase leading-[27px] text-text-on-accent md:text-[32px] md:leading-8">
        {{ entrepreneur.name }}
      </span>
      <span class="absolute right-4 top-5 z-[2] text-text-on-accent" aria-hidden="true">
        <ArrowMark />
      </span>
      <span class="absolute bottom-4 right-4 z-[2] max-w-[58%] text-right font-sans text-base uppercase leading-4 text-text-on-accent">
        {{ entrepreneur.title }}
      </span>
    </template>
  </NuxtLink>
</template>
