<script setup lang="ts">
import type { LandingPlaceCard } from '@features/landing/model/landing.data'
import LandingPlaceCardComponent from '@features/landing/ui/sections/components/LandingPlaceCard.vue'
import LandingSlider from '@features/landing/ui/slider/LandingSlider.vue'
import { protectPrepositions } from '@shared/lib/typography'
import ButtonLink from '@shared/ui/buttons/ButtonLink.vue'
import { ROUTES } from '@shared/navigation'
import SectionTitle from '@shared/ui/page/SectionTitle.vue'

const props = defineProps<{
  title: string
  description: string
}>()

const protectedTitle = computed(() => protectPrepositions(props.title))

const { data } = await useFetch<{ businesses: LandingPlaceCard[] }>('/api/businesses')

const places = computed(() => data.value?.businesses ?? [])
</script>

<template>
  <section class="border-b border-border-strong bg-bg">
    <div class="mx-auto w-full max-w-[1920px] px-4 py-12 sm:px-6 lg:px-10 lg:py-16">
      <div class="mb-8 flex flex-col gap-5 lg:mb-10">
        <div class="flex items-center justify-between gap-6">
          <SectionTitle>
            {{ protectedTitle }}
          </SectionTitle>

          <ButtonLink
            :to="ROUTES.COMPANIES"
            desktop-only
            class="w-fit shrink-0"
          >
            Еще
          </ButtonLink>
        </div>

        <p class="max-w-[860px] font-sans text-base leading-4 text-text/78">
          {{ description }}
        </p>
      </div>

      <div v-if="places.length">
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

      <p
        v-else
        class="px-2 py-12 font-sans text-sm uppercase tracking-[0.14em] text-text/55"
      >
        Места появятся после первой публикации
      </p>
    </div>
  </section>
</template>
