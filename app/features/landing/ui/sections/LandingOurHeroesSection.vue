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

const mobileHeroes = computed(() => props.heroes.slice(0, 6))
const visibleHeroes = computed(() => {
  const featured = props.heroes.length <= 3 ? props.heroes : props.heroes.slice(2, 6)
  const visibleCount = featured.length - (featured.length % 3)

  return visibleCount > 0 ? featured.slice(0, visibleCount) : featured
})
const protectedTitle = computed(() => protectPrepositions(props.title))
</script>

<template>
  <section :id="sectionId" class="bg-bg">
    <div class="mx-auto w-full max-w-[1920px] px-4 py-12 sm:px-6 lg:px-10 lg:py-16">
      <div class="mb-8 flex flex-col gap-5 lg:mb-10">
        <div class="flex items-center justify-between gap-6">
          <SectionTitle>
            {{ protectedTitle }}
          </SectionTitle>

          <ButtonLink
            v-if="showMore"
            :to="ROUTES.ENTREPRENEURS"
            desktop-only
            class="w-fit shrink-0"
          >
            Еще
          </ButtonLink>
        </div>

        <p v-if="description" class="max-w-[860px] font-sans text-base leading-4 text-text/78">
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
