<script setup lang="ts">
import type { LandingAudienceCard } from '@features/landing/model/landing.data'
import { protectPrepositions } from '@shared/lib/typography'

const props = withDefaults(defineProps<{
  card: LandingAudienceCard
  variant?: 'light' | 'accent'
}>(), {
  variant: 'light',
})

const title = computed(() => protectPrepositions(props.card.title))
const description = computed(() => protectPrepositions(props.card.description || ''))
const hoverTitle = computed(() => protectPrepositions(props.card.hoverTitle ?? props.card.title))
const hoverDescription = computed(() => protectPrepositions(props.card.hoverDescription ?? props.card.description ?? ''))
const isRevealed = ref(false)

const colorClass = computed(() => {
  if (props.variant === 'accent') {
    return isRevealed.value
      ? 'bg-surface text-text'
      : 'bg-accent text-text-on-accent hover:bg-surface hover:text-text'
  }

  return isRevealed.value
    ? 'bg-accent text-text-on-accent'
    : 'bg-surface/60 text-text hover:bg-accent backdrop-blur-[12px] hover:text-text-on-accent'
})

const toggleReveal = () => {
  isRevealed.value = !isRevealed.value
}
</script>

<template>
  <button
    type="button"
    class="group relative block touch-manipulation overflow-hidden border border-border p-4 text-left transition-colors duration-350 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
    :class="colorClass"
    :aria-pressed="isRevealed"
    :aria-label="isRevealed ? `Скрыть описание: ${card.title}` : `Показать описание: ${card.title}`"
    @click="toggleReveal"
    @keydown.esc="isRevealed = false"
  >
    <span
      aria-hidden="true"
      class="pointer-events-none absolute right-4 top-4 z-10 block h-7 w-12 shrink-0 bg-current [-webkit-mask:url(/images/arrow-right-corner.svg)_center/contain_no-repeat] [mask:url(/images/arrow-right-corner.svg)_center/contain_no-repeat]"
    />

    <div
      class="absolute inset-4 flex flex-col justify-end transition-[opacity,transform] duration-350 group-hover:-translate-y-2.5 group-hover:opacity-0"
      :class="isRevealed ? '-translate-y-2.5 opacity-0' : 'translate-y-0 opacity-100'"
    >
      <strong class="max-w-[88%] whitespace-pre-line font-sans text-[22px] font-bold uppercase leading-[1.05] tracking-[-0.6px] sm:text-[26px] sm:leading-7 md:text-[30px] md:leading-8 md:tracking-[-1.25px]">
        {{ title }}
      </strong>
      <small
        v-if="description"
        class="mt-2 max-w-[88%] whitespace-pre-line font-sans text-sm leading-5"
      >
        {{ description }}
      </small>
    </div>

    <div
      class="absolute inset-4 flex flex-col justify-end transition-[opacity,transform] duration-350 group-hover:translate-y-0 group-hover:opacity-100"
      :class="isRevealed ? 'translate-y-0 opacity-100' : 'translate-y-2.5 opacity-0'"
    >
      <strong class="whitespace-pre-line font-sans text-base font-normal uppercase leading-4 tracking-normal">
        {{ hoverTitle }}
      </strong>
      <small
        v-if="hoverDescription"
        class="mt-2 max-w-[88%] whitespace-pre-line font-sans text-sm leading-5"
      >
        {{ hoverDescription }}
      </small>
    </div>
  </button>
</template>
