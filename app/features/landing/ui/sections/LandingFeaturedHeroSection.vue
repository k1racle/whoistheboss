<script setup lang="ts">
import { landingFeaturedHero } from '@features/landing/model/landing.data'
import { ROUTES } from '@shared/navigation'

const hoverSrc = landingFeaturedHero.imageHover || landingFeaturedHero.image
</script>

<template>
  <section class="bg-bg">
    <div class="mx-auto w-full max-w-[1920px] px-4 py-12 sm:px-6 lg:px-10 lg:py-16">
      <NuxtLink
        :to="ROUTES.ENTREPRENEURS"
        class="group block overflow-hidden border border-accent/20 bg-accent shadow-[0_30px_80px_rgba(219,42,0,0.18)] transition-transform duration-300 hover:-translate-y-1"
      >
        <div class="grid">
          <NuxtImg
            :src="landingFeaturedHero.image"
            :alt="landingFeaturedHero.imageAlt"
            class="col-start-1 row-start-1 h-full w-full object-cover transition-opacity duration-500 group-hover:opacity-0"
            densities="x1 x2"
          />
          <NuxtImg
            :src="hoverSrc"
            :alt="landingFeaturedHero.imageAlt"
            class="col-start-1 row-start-1 h-full w-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            densities="x1 x2"
          />
        </div>
      </NuxtLink>
    </div>
  </section>
</template>
