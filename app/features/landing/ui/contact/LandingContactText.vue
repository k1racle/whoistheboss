<script setup lang="ts">
import { protectPrepositions } from '@shared/lib/typography'

const props = defineProps<{
  ctaTitle: string
  formTitle: string
  formDescription: string
}>()

const protectedFormTitle = computed(() => protectPrepositions(props.formTitle))
const protectedFormDescription = computed(() => protectPrepositions(props.formDescription))
const protectedCtaTitle = computed(() => protectPrepositions(props.ctaTitle))
</script>

<template>
  <div class="flex flex-1 flex-col justify-between gap-10 lg:min-w-0 lg:[container-type:inline-size]">
    <div class="order-2 lg:order-1">
      <h2 class="max-w-[520px] whitespace-pre-line font-sans text-[15.82px] font-bold uppercase leading-[13.84px] lg:text-[clamp(1.625rem,2.2vw,2rem)] lg:leading-8 lg:tracking-[-0.04em]">
        {{ protectedFormTitle }}
      </h2>

      <p class="mt-1 max-w-[520px] whitespace-pre-line font-sans text-xs leading-5 text-text-on-accent lg:mt-5 lg:text-sm lg:leading-5">
        {{ protectedFormDescription }}
      </p>
    </div>

    <p
      class="order-1 max-w-full whitespace-pre-line font-display text-[clamp(4.125rem,15vw,6.875rem)] font-black uppercase leading-none tracking-[-0.03em] md:text-[clamp(5.5rem,13vw,8.5rem)] lg:order-2 lg:translate-y-[0.13em] lg:text-[clamp(4.875rem,18cqw,13.625rem)] lg:leading-[0.78]"
    >
      {{ protectedCtaTitle }}
    </p>
  </div>
</template>
