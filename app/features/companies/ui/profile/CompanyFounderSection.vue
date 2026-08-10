<script setup lang="ts">
import { getDisplayNameSize } from '@shared/lib/typography'

const props = defineProps<{
  ownerName: string
  ownerTitle: string
  ownerQuote: string | null
  ownerHeroRightTeaser: string | null
  ownerHeroBottomRightTeaser: string | null
  photo: string | null
}>()

const nameParts = computed(() => props.ownerName.trim().split(/\s+/).filter(Boolean))
const lastName = computed(() => nameParts.value[0] || props.ownerName)
const firstName = computed(() => nameParts.value.slice(1).join(' '))
const topText = computed(() => props.ownerHeroRightTeaser || props.ownerQuote || props.ownerTitle)
const bottomText = computed(() => props.ownerHeroBottomRightTeaser || props.ownerTitle)
const displayNameSize = computed(() => getDisplayNameSize(props.ownerName))
</script>

<template>
  <section class="relative min-h-svh bg-bg px-5 py-[90px] sm:px-6 lg:px-10 lg:pb-[100px] lg:pt-[380px]">
    <div class="mx-auto w-full max-w-[1920px]">
      <div class="mx-auto aspect-[0.78] w-[min(78vw,520px)] overflow-hidden bg-border-strong lg:w-[min(560px,34vw)]">
        <img
          v-if="photo"
          :src="photo"
          :alt="ownerName"
          class="h-full w-full object-cover"
        >
      </div>

      <div class="mt-11 hidden lg:block">
        <div class="flex w-full items-start justify-between gap-10">
          <p class="m-0 w-[500px] max-w-[500px] shrink-0 translate-y-3 whitespace-pre-line text-right font-sans text-base font-bold uppercase leading-4 text-text">
            {{ topText }}
          </p>
          <h2 class="m-0 ml-auto whitespace-nowrap text-right font-display font-black uppercase leading-none tracking-[-0.03em] text-accent" :class="displayNameSize">
            {{ lastName }}
          </h2>
        </div>

        <div class="-mt-20 flex w-full items-end justify-between gap-10">
          <h2 class="m-0 whitespace-nowrap font-display font-black uppercase leading-none tracking-[-0.03em] text-accent" :class="displayNameSize">
            {{ firstName }}
          </h2>
          <p class="m-0 ml-auto w-[500px] max-w-[500px] shrink-0 -translate-y-20 whitespace-pre-line text-left font-sans text-base font-bold uppercase leading-4 text-text">
            {{ bottomText }}
          </p>
        </div>
      </div>

      <div class="mt-11 flex flex-col lg:hidden">
        <p class="m-0 mb-4 whitespace-pre-line font-sans text-[13px] font-bold uppercase leading-[14px] text-text">
          {{ topText }}
        </p>
        <h2 class="m-0 font-display text-[clamp(72px,20vw,160px)] font-black uppercase leading-[0.88] tracking-[-0.03em] text-accent">
          {{ firstName || lastName }}
        </h2>
        <h2 v-if="firstName" class="m-0 font-display text-[clamp(72px,20vw,160px)] font-black uppercase leading-[0.88] tracking-[-0.03em] text-accent">
          {{ lastName }}
        </h2>
        <p class="m-0 mt-4 whitespace-pre-line font-sans text-[13px] font-bold uppercase leading-[14px] text-text">
          {{ bottomText }}
        </p>
      </div>
    </div>
  </section>
</template>
