<script setup lang="ts">
import type { LandingAudienceCard } from '@features/landing/model/landing.data'
import AudienceCard from '@features/landing/ui/audience/AudienceCard.vue'

defineProps<{
  cards: LandingAudienceCard[]
}>()

defineSlots<{
  intro(): unknown
}>()

const SLOT_POSITIONS = [
  [1, 1],
  [3, 2],
  [2, 3],
  [4, 4],
  [2, 5],
  [1, 6],
  [4, 6],
] as const

const slotStyle = (index: number) => {
  const [column, row] = SLOT_POSITIONS[index % SLOT_POSITIONS.length]!
  return {
    '--slot-column': column,
    '--slot-row': row,
  }
}
</script>

<template>
  <section id="about" class="bg-bg px-4 py-14 sm:px-6 lg:px-10 lg:py-24">
    <div class="mx-auto w-full max-w-[1920px]">
      <header v-if="$slots.intro" class="mb-12 ml-auto max-w-[760px] lg:mb-20">
        <slot name="intro" />
      </header>

      <div class="flex flex-col gap-5 lg:grid lg:grid-cols-4 lg:gap-0">
        <AudienceCard
          v-for="(card, index) in cards"
          :key="card.id"
          :card="card"
          :variant="index % 2 === 0 ? 'accent' : 'light'"
          class="audience-slot aspect-square w-[85%] lg:m-0 lg:w-full"
          :class="index % 2 === 0 ? 'mr-auto' : 'ml-auto'"
          :style="slotStyle(index)"
        />
      </div>
    </div>
  </section>
</template>

<style scoped>
@media (min-width: 1024px) {
  .audience-slot {
    grid-column: var(--slot-column);
    grid-row: var(--slot-row);
  }
}
</style>
