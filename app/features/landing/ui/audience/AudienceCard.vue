<script setup lang="ts">
import type { LandingAudienceCard } from '@features/landing/model/landing.data'

withDefaults(defineProps<{
  card: LandingAudienceCard
  variant?: 'light' | 'accent'
}>(), {
  variant: 'light',
})
</script>

<template>
  <article
    class="group relative overflow-hidden border border-border p-4 backdrop-blur-[12px] transition-colors duration-350"
    :class="
      variant === 'accent'
        ? 'bg-accent/85 text-text-on-accent hover:bg-surface/70 hover:text-text'
        : 'bg-surface/60 text-text hover:bg-accent/85 hover:text-text-on-accent'
    "
  >
    <span
      aria-hidden="true"
      class="pointer-events-none absolute right-4 top-4 z-10 block h-7 w-12 shrink-0 bg-current [-webkit-mask:url(/images/frame-1321316003.svg)_center/contain_no-repeat] [mask:url(/images/frame-1321316003.svg)_center/contain_no-repeat]"
    />

    <div class="absolute inset-4 flex flex-col justify-end transition-[opacity,transform] duration-350 group-hover:-translate-y-2.5 group-hover:opacity-0">
      <strong class="max-w-[88%] font-display text-[clamp(2rem,2.8vw,2.8rem)] font-black uppercase leading-[0.88] tracking-[-0.05em]">
        {{ card.title }}
      </strong>
      <small
        v-if="card.description"
        class="mt-2 max-w-[88%] font-sans text-sm leading-5"
      >
        {{ card.description }}
      </small>
    </div>

    <div class="absolute inset-4 flex translate-y-2.5 flex-col justify-end opacity-0 transition-[opacity,transform] duration-350 group-hover:translate-y-0 group-hover:opacity-100">
      <strong class="font-sans text-base font-normal uppercase leading-4 tracking-normal">
        {{ card.hoverTitle ?? card.title }}
      </strong>
      <small
        v-if="card.hoverDescription || card.description"
        class="mt-2 max-w-[88%] font-sans text-sm leading-5"
      >
        {{ card.hoverDescription ?? card.description }}
      </small>
    </div>
  </article>
</template>
