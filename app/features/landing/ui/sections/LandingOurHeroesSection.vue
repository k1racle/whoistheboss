<script setup lang="ts">
import { landingHeroes, type LandingHeroCard } from '@features/landing/model/landing.data'
import LandingHeroCardItem from '@features/landing/ui/cards/LandingHeroCard.vue'
import LandingSlider from '@features/landing/ui/slider/LandingSlider.vue'
import ArrowText from '@shared/ui/icons/ArrowText.vue'
import { ROUTES } from '@shared/navigation'

withDefaults(defineProps<{
  title: string
  description: string
  heroes?: LandingHeroCard[]
  sectionId?: string
  showMore?: boolean
}>(), {
  heroes: () => landingHeroes,
  sectionId: undefined,
  showMore: true,
})
</script>

<template>
  <section :id="sectionId" class="bg-bg">
    <div class="mx-auto w-full max-w-[1920px] px-4 py-12 sm:px-6 lg:px-10 lg:py-24">
      <div class="mb-10 flex flex-col gap-5 lg:mb-20">
        <div class="space-y-6">
          <h2 class="text-center font-display text-[clamp(80px,16.6667vw,320px)] font-black uppercase leading-none tracking-[-0.03em] text-text">
            {{ title }}
          </h2>
          <p v-if="description" class="mx-auto max-w-[860px] text-center font-sans text-sm leading-6 text-text/78 sm:text-base lg:text-xl lg:leading-7">
            {{ description }}
          </p>
        </div>

        <NuxtLink
          v-if="showMore"
          :to="ROUTES.ENTREPRENEURS"
          class="inline-flex w-fit min-h-11 items-center justify-center gap-2 border border-accent bg-accent px-4 py-2.5 font-sans text-sm font-bold uppercase tracking-[0.12em] text-text-on-accent transition-colors hover:border-text"
        >
          Еще
          <ArrowText />
        </NuxtLink>
      </div>

      <LandingSlider
        :items-count="heroes.length"
        aria-label="Мобильный слайдер секции Наши герои"
      >
        <LandingHeroCardItem
          v-for="hero in heroes"
          :key="hero.id"
          :hero="hero"
          class="w-[70%] max-w-[70%] shrink-0 snap-center overflow-hidden bg-surface"
        />
      </LandingSlider>

      <div class="hidden gap-3 md:grid md:grid-cols-2 xl:grid-cols-3">
        <LandingHeroCardItem
          v-for="hero in heroes"
          :key="hero.id"
          :hero="hero"
        />
      </div>
    </div>
  </section>
</template>
