<script setup lang="ts">
import type { BlogRelatedEntrepreneur } from '@features/blog/model/blog.types'
import { ROUTES } from '@shared/navigation'

const props = defineProps<{
  entrepreneur: BlogRelatedEntrepreneur
}>()

const imageSrc = computed(() => props.entrepreneur.photo || '/images/placeholder.svg')
const hoverImageSrc = computed(() => props.entrepreneur.hoverPhoto || '')
const shouldLoadHover = shallowRef(false)
const hasDistinctHoverImage = computed(() => Boolean(
  hoverImageSrc.value && hoverImageSrc.value !== imageSrc.value,
))

function loadHoverImage() {
  if (hasDistinctHoverImage.value) shouldLoadHover.value = true
}
</script>

<template>
  <NuxtLink
    :to="ROUTES.ENTREPRENEUR(entrepreneur.slug)"
    class="group relative grid aspect-square min-w-0 overflow-hidden bg-accent text-text-on-accent no-underline"
    :aria-label="`${entrepreneur.name}, ${entrepreneur.title}`"
    @pointerenter="loadHoverImage"
    @focusin="loadHoverImage"
  >
    <div class="col-start-1 row-start-1 bg-accent" aria-hidden="true" />
    <NuxtImg
      :src="imageSrc"
      :alt="entrepreneur.name"
      sizes="320:100vw 480:100vw sm:100vw md:33vw 2000:614px"
      format="webp"
      class="col-start-1 row-start-1 h-full w-full object-cover"
      loading="lazy"
      decoding="async"
    />
    <NuxtImg
      v-if="shouldLoadHover && hasDistinctHoverImage"
      :src="hoverImageSrc"
      alt=""
      sizes="320:100vw 480:100vw sm:100vw md:33vw 2000:614px"
      format="webp"
      class="col-start-1 row-start-1 h-full w-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-focus-visible:opacity-100"
      loading="eager"
      fetchpriority="low"
      decoding="async"
    />
  </NuxtLink>
</template>
