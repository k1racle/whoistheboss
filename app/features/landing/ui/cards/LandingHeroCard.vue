<script setup lang="ts">
import type { LandingHeroCard as LandingHeroCardData } from '@features/landing/model/landing.data'
import { ROUTES } from '@shared/navigation'

defineProps<{
  hero: LandingHeroCardData
}>()

const useImageFallback = (payload: string | Event) => {
  if (typeof payload === 'string') return

  const image = payload.currentTarget
  if (!(image instanceof HTMLImageElement) || image.src.endsWith('/images/placeholder.svg')) return

  image.src = '/images/placeholder.svg'
}
</script>

<template>
  <NuxtLink
    :to="hero.href || ROUTES.ENTREPRENEURS"
    class="group block overflow-hidden bg-surface"
    :aria-label="`${hero.name}, ${hero.role}`"
  >
    <div class="grid h-full w-full">
      <div class="col-start-1 row-start-1 aspect-square bg-linear-to-br from-border-strong to-bg" aria-hidden="true" />
      <NuxtImg
        :src="hero.image"
        :alt="hero.imageAlt"
        class="col-start-1 row-start-1 aspect-square h-full w-full object-cover transition-opacity duration-500 group-hover:opacity-0"
        loading="lazy"
        @error="useImageFallback"
      />
      <NuxtImg
        :src="hero.imageHover || hero.image"
        alt=""
        class="col-start-1 row-start-1 aspect-square h-full w-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        loading="lazy"
        @error="useImageFallback"
      />
    </div>
  </NuxtLink>
</template>
