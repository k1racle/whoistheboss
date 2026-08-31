<script setup lang="ts">
import type { LandingHeroCard as LandingHeroCardData } from '@features/landing/model/landing.data'
import { ROUTES } from '@shared/navigation'

const props = defineProps<{
  hero: LandingHeroCardData
  priority?: boolean
}>()

const shouldLoadHover = shallowRef(false)
const hoverImageFailed = shallowRef(false)
const hasDistinctHoverImage = computed(() => Boolean(
  props.hero.imageHover && props.hero.imageHover !== props.hero.image,
))

function loadHoverImage() {
  if (hasDistinctHoverImage.value) shouldLoadHover.value = true
}

const useImageFallback = (event: string | Event) => {
  if (!(event instanceof Event)) return

  const image = event.currentTarget
  if (!(image instanceof HTMLImageElement) || image.src.endsWith('/images/placeholder.svg')) return

  image.removeAttribute('srcset')
  image.removeAttribute('sizes')
  image.src = '/images/placeholder.svg'
}

const hideBrokenHoverImage = (event: string | Event) => {
  if (!(event instanceof Event)) return

  const image = event.currentTarget
  if (!(image instanceof HTMLImageElement)) return

  hoverImageFailed.value = true
}
</script>

<template>
  <NuxtLink
    :to="hero.href || ROUTES.ENTREPRENEURS"
    class="group block overflow-hidden bg-surface"
    :aria-label="`${hero.name}, ${hero.role}`"
    @pointerenter="loadHoverImage"
    @focusin="loadHoverImage"
  >
    <div class="grid h-full w-full">
      <div class="col-start-1 row-start-1 aspect-square bg-linear-to-br from-border-strong to-bg" aria-hidden="true" />
      <NuxtImg
        :src="hero.image"
        :alt="hero.imageAlt"
        sizes="320:85vw 480:85vw sm:85vw md:50vw xl:33vw 2000:614px"
        format="webp"
        class="col-start-1 row-start-1 aspect-square h-full w-full object-cover"
        :loading="priority ? 'eager' : 'lazy'"
        :fetchpriority="priority ? 'high' : 'auto'"
        decoding="async"
        @error="useImageFallback"
      />
      <NuxtImg
        v-if="shouldLoadHover && hasDistinctHoverImage && !hoverImageFailed"
        :src="hero.imageHover"
        alt=""
        sizes="320:85vw 480:85vw sm:85vw md:50vw xl:33vw 2000:614px"
        format="webp"
        class="col-start-1 row-start-1 aspect-square h-full w-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        loading="eager"
        fetchpriority="low"
        decoding="async"
        @error="hideBrokenHoverImage"
      />
    </div>
  </NuxtLink>
</template>
