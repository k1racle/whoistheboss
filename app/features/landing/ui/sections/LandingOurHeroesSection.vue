<script setup lang="ts">
import { landingHeroes, type LandingHeroCard } from '@features/landing/model/landing.data'
import LandingHeroCardItem from '@features/landing/ui/cards/LandingHeroCard.vue'
import LandingSlider from '@features/landing/ui/slider/LandingSlider.vue'
import ArrowText from '@shared/ui/icons/ArrowText.vue'
import { ROUTES } from '@shared/navigation'

const props = withDefaults(defineProps<{
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

const mobileHeroes = computed(() => props.heroes.slice(0, 6))
const visibleHeroes = computed(() => {
  const featured = props.heroes.length <= 3 ? props.heroes : props.heroes.slice(2, 6)
  const visibleCount = featured.length - (featured.length % 3)

  return visibleCount > 0 ? featured.slice(0, visibleCount) : featured
})
</script>

<template>
  <section :id="sectionId" class="bg-bg">
    <div class="mx-auto w-full max-w-[1920px] px-4 py-12 sm:px-6 lg:px-10 lg:py-16">
      <div class="mb-8 flex flex-col gap-5 lg:mb-10">
        <div class="flex items-center justify-between gap-6">
          <h2 class="font-display text-[clamp(3rem,8vw,6rem)] font-black uppercase leading-[0.88] tracking-[-3%] text-text">
            {{ title }}
          </h2>

          <NuxtLink
            v-if="showMore"
            :to="ROUTES.ENTREPRENEURS"
            class="hidden min-h-11 w-fit shrink-0 items-center justify-center gap-2 border border-accent bg-accent px-4 py-2.5 font-sans text-sm font-bold uppercase tracking-[0.12em] text-text-on-accent transition-colors hover:border-text lg:inline-flex"
          >
            Еще
            <ArrowText />
          </NuxtLink>
        </div>

        <p v-if="description" class="max-w-[860px] font-sans text-sm leading-6 text-text/78 sm:text-base">
          {{ description }}
        </p>
      </div>

      <LandingSlider
        :items-count="mobileHeroes.length"
        aria-label="Мобильный слайдер секции Наши герои"
      >
        <LandingHeroCardItem
          v-for="hero in mobileHeroes"
          :key="hero.id"
          :hero="hero"
          class="w-[70%] max-w-[70%] shrink-0 snap-center overflow-hidden bg-surface"
        />
      </LandingSlider>

      <div class="hidden gap-3 md:grid md:grid-cols-2 xl:grid-cols-3">
        <LandingHeroCardItem
          v-for="hero in visibleHeroes"
          :key="hero.id"
          :hero="hero"
        />
      </div>
    </div>
  </section>
</template>
