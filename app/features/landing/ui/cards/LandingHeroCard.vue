<script setup lang="ts">
import type { LandingHeroCard as LandingHeroCardData } from '@features/landing/model/landing.data'
import { ROUTES } from '@shared/navigation'

defineProps<{
  hero: LandingHeroCardData
}>()

const useImageFallback = (event: string | Event) => {
  if (!(event instanceof Event)) return

  const image = event.currentTarget
  if (!(image instanceof HTMLImageElement) || image.src.endsWith('/images/placeholder.svg')) return

  image.removeAttribute('srcset')
  image.removeAttribute('sizes')
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
        sizes="320:85vw 480:85vw sm:85vw md:50vw xl:33vw 2000:614px"
        format="webp"
        class="col-start-1 row-start-1 aspect-square h-full w-full object-cover transition-opacity duration-500 group-hover:opacity-0"
        loading="lazy"
        decoding="async"
        @error="useImageFallback"
      />
      <NuxtImg
        :src="hero.imageHover || hero.image"
        alt=""
        sizes="320:85vw 480:85vw sm:85vw md:50vw xl:33vw 2000:614px"
        format="webp"
        class="col-start-1 row-start-1 aspect-square h-full w-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        loading="lazy"
        decoding="async"
        @error="useImageFallback"
      />
    </div>
  </NuxtLink>
</template>
