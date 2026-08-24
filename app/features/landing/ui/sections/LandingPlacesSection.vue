<script setup lang="ts">
import type { CompanyCatalogItem } from '@features/companies/model/companies-page.types'
import CompanyCatalogCard from '@features/companies/ui/CompanyCatalogCard.vue'
import LandingSlider from '@features/landing/ui/slider/LandingSlider.vue'
import { protectPrepositions } from '@shared/lib/typography'
import ButtonLink from '@shared/ui/buttons/ButtonLink.vue'
import { ROUTES } from '@shared/navigation'
import SectionTitle from '@shared/ui/page/SectionTitle.vue'

const props = defineProps<{
  title: string
  description: string
  places: CompanyCatalogItem[]
}>()

const protectedTitle = computed(() => protectPrepositions(props.title))
const protectedDescription = computed(() => protectPrepositions(props.description))

</script>

<template>
  <section class="relative border-b border-border-strong bg-bg">
    <div class="mx-auto w-full max-w-[1920px] px-4 py-12 sm:px-6 lg:px-10 lg:py-16">
      <div class="mb-8 flex flex-col gap-5 lg:mb-10 lg:pr-40">
        <div>
          <SectionTitle>
            {{ protectedTitle }}
          </SectionTitle>
        </div>

        <p class="max-w-[860px] font-sans text-base leading-4 text-text/78">
          {{ protectedDescription }}
        </p>
      </div>

      <div v-if="places.length">
        <LandingSlider
          :items-count="places.length"
          aria-label="Мобильный слайдер секции Места"
          desktop-track-class="md:grid md:grid-cols-3 md:gap-6"
        >
          <CompanyCatalogCard
            v-for="place in places"
            :key="place.slug"
            :company="place"
            class="w-[70%] min-w-[70%] max-w-[70%] shrink-0 snap-center md:w-auto md:min-w-0 md:max-w-none"
          />
        </LandingSlider>
      </div>

      <p
        v-else
        class="px-2 py-12 font-sans text-sm uppercase tracking-[0.14em] text-text/55"
      >
        Места появятся после первой публикации
      </p>
    </div>

    <ButtonLink
      :to="ROUTES.COMPANIES"
      desktop-only
      class="absolute right-4 top-12 w-fit sm:right-6 lg:right-10 lg:top-16"
    >
      Еще
    </ButtonLink>
  </section>
</template>
