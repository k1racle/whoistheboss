<script setup lang="ts">
import type { LandingPlaceCard } from '@features/landing/model/landing.data'
import { landingPlacesDescription, landingPlacesFallback } from '@features/landing/model/landing.data'
import LandingPlaceCardComponent from '@features/landing/ui/sections/components/LandingPlaceCard.vue'
import LandingSlider from '@features/landing/ui/slider/LandingSlider.vue'
import ArrowText from '@shared/ui/icons/ArrowText.vue'
import { ROUTES } from '@shared/navigation'

const { data } = await useFetch<{ businesses: LandingPlaceCard[] }>('/api/businesses')

const places = computed(() => data.value?.businesses ?? landingPlacesFallback)
</script>

<template>
  <section class="border-b border-border-strong bg-bg">
    <div class="mx-auto w-full max-w-[1920px] px-4 py-12 sm:px-6 lg:px-10 lg:py-16">
      <div class="mb-8 flex flex-col gap-5 lg:mb-10 lg:flex-row lg:items-end lg:justify-between">
        <div class="max-w-[980px] space-y-4">
          <h2 class="font-display text-[clamp(3rem,8vw,6rem)] font-black uppercase leading-[0.88] tracking-[-3%] text-text">
            Места
          </h2>
          <p class="max-w-[860px] font-sans text-sm leading-6 text-text/78 sm:text-base">
            {{ landingPlacesDescription }}
          </p>
        </div>

        <NuxtLink
          :to="ROUTES.COMPANIES"
          class="inline-flex w-fit min-h-11 items-center justify-center gap-2 border border-accent bg-accent px-4 py-2.5 font-sans text-sm font-bold uppercase tracking-[0.12em] text-text-on-accent transition-colors hover:border-text"
        >
          Еще
          <ArrowText />
        </NuxtLink>
      </div>

      <LandingSlider
        :items-count="places.length"
        aria-label="Мобильный слайдер секции Места"
      >
        <LandingPlaceCardComponent
          v-for="place in places"
          :key="place.slug"
          :item="place"
          as-slide
        />
      </LandingSlider>

      <div class="hidden gap-6 md:grid md:grid-cols-3">
        <LandingPlaceCardComponent
          v-for="place in places"
          :key="place.slug"
          :item="place"
        />
      </div>
    </div>
  </section>
</template>
