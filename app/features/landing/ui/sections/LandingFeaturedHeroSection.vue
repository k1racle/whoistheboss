<script setup lang="ts">
import { landingFeaturedHero } from '@features/landing/model/landing.data'

defineProps<{
  image: string
  mobileImage?: string
  link: string
}>()
</script>

<template>
  <section class="bg-bg">
    <div class="mx-auto w-full max-w-[1920px] px-4 py-12 sm:px-6 lg:px-10 lg:py-16">
      <NuxtLink
        :to="link"
        class="group block overflow-hidden border border-accent/20 bg-accent shadow-[0_30px_80px_rgba(219,42,0,0.18)]"
        :aria-label="`Открыть материал баннера: ${landingFeaturedHero.name}`"
      >
        <picture v-if="image">
          <source
            v-if="mobileImage"
            media="(max-width: 768px)"
            :srcset="mobileImage"
          >
          <img
            :src="image"
            :alt="landingFeaturedHero.imageAlt"
            class="h-full w-full object-cover"
          />
        </picture>

        <div
          v-else
          class="flex min-h-[280px] items-center justify-center bg-text px-8 py-12 text-center sm:min-h-[340px]"
        >
          <p class="font-display text-[clamp(2rem,7vw,5rem)] font-black uppercase leading-[0.9] tracking-[-0.04em] text-text-on-accent whitespace-pre-line">
            Здесь будет
            <br>
            баннер для
            <br>
            выпуска с
            <br>
            новым героем
          </p>
        </div>
      </NuxtLink>
    </div>
  </section>
</template>
