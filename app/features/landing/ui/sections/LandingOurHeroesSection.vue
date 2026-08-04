<script setup lang="ts">
import { landingHeroes, landingHeroesDescription } from '@features/landing/model/landing.data'
import LandingSlider from '@features/landing/ui/slider/LandingSlider.vue'
import SlideImage from '@features/landing/ui/slider/SlideImage.vue'
import { ROUTES } from '@shared/navigation'
</script>

<template>
  <section class="border-b border-border-strong bg-bg">
    <div class="mx-auto w-full max-w-[1920px] px-4 py-12 sm:px-6 lg:px-10 lg:py-16">
      <div class="mb-8 flex flex-col gap-5 lg:mb-10 lg:flex-row lg:items-end lg:justify-between">
        <div class="max-w-[980px] space-y-4">
          <h2 class="font-display text-[clamp(3rem,8vw,6rem)] font-black uppercase leading-[0.88] tracking-[-0.05em] text-text">
            Наши герои
          </h2>
          <p class="max-w-[860px] font-sans text-sm leading-6 text-text/78 sm:text-base">
            {{ landingHeroesDescription }}
          </p>
        </div>

        <NuxtLink
          :to="ROUTES.ENTREPRENEURS"
          class="inline-flex w-fit min-h-11 items-center justify-center gap-2 border border-accent bg-accent px-4 py-2.5 font-sans text-sm font-bold uppercase tracking-[0.12em] text-text-on-accent transition-colors hover:border-text hover:bg-text"
        >
          Еще
          <span aria-hidden="true">[ ↗ ]</span>
        </NuxtLink>
      </div>

      <LandingSlider
        :items-count="landingHeroes.length"
        aria-label="Мобильный слайдер секции Наши герои"
      >
        <SlideImage
          v-for="hero in landingHeroes"
          :key="hero.id"
          :src="hero.image"
          :alt="hero.imageAlt"
        />
      </LandingSlider>

      <div class="hidden gap-6 md:grid md:grid-cols-2 xl:grid-cols-3">
        <NuxtLink
          v-for="hero in landingHeroes"
          :key="hero.id"
          :to="ROUTES.ENTREPRENEURS"
          class="group block overflow-hidden border border-border-strong bg-surface shadow-[0_20px_44px_rgba(7,7,7,0.08)] transition-transform duration-300 hover:-translate-y-1"
          :aria-label="`${hero.name}, ${hero.role}`"
        >
          <NuxtImg
            :src="hero.image"
            :alt="hero.imageAlt"
            class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
            densities="x1 x2"
          />
        </NuxtLink>
      </div>
    </div>
  </section>
</template>
