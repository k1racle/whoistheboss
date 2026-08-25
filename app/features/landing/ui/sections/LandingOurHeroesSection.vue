<script setup lang="ts">
import type { LandingHeroCard } from '@features/landing/model/landing.data'
import LandingHeroCardItem from '@features/landing/ui/cards/LandingHeroCard.vue'
import LandingSlider from '@features/landing/ui/slider/LandingSlider.vue'
import { protectPrepositions } from '@shared/lib/typography'
import ButtonLink from '@shared/ui/buttons/ButtonLink.vue'
import { ROUTES } from '@shared/navigation'
import SectionTitle from '@shared/ui/page/SectionTitle.vue'

const props = withDefaults(defineProps<{
  title: string
  description: string
  heroes: LandingHeroCard[]
  sectionId?: string
  showMore?: boolean
}>(), {
  sectionId: undefined,
  showMore: true,
})

const visibleHeroes = computed(() => props.heroes.slice(0, 6))
const protectedTitle = computed(() => protectPrepositions(props.title))
const protectedDescription = computed(() => protectPrepositions(props.description))
</script>

<template>
  <section :id="sectionId" class="relative bg-bg">
    <div class="mx-auto w-full max-w-[1920px] px-4 py-12 sm:px-6 lg:px-10 lg:py-16">
      <div class="mb-8 flex flex-col gap-5 lg:mb-10 lg:pr-40">
        <div>
          <SectionTitle>
            {{ protectedTitle }}
          </SectionTitle>
        </div>

        <p v-if="description" class="max-w-[860px] whitespace-pre-line font-sans text-base leading-4 text-text/78">
          {{ protectedDescription }}
        </p>
      </div>

      <LandingSlider
        :items-count="visibleHeroes.length"
        aria-label="Мобильный слайдер секции Наши герои"
        desktop-track-class="md:grid md:grid-cols-2 md:gap-3 xl:grid-cols-3"
      >
        <LandingHeroCardItem
          v-for="hero in visibleHeroes"
          :key="hero.id"
          :hero="hero"
          :priority="visibleHeroes.indexOf(hero) < 3"
          class="w-[70%] max-w-[70%] shrink-0 snap-center overflow-hidden bg-surface md:w-auto md:max-w-none"
        />
      </LandingSlider>
    </div>

    <ButtonLink
      v-if="showMore"
      :to="ROUTES.ENTREPRENEURS"
      desktop-only
      class="absolute right-4 top-12 w-fit sm:right-6 lg:right-10 lg:top-16"
    >
      Еще
    </ButtonLink>
  </section>
</template>
