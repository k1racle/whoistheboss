<script setup lang="ts">
import { ROUTES } from '@shared/navigation'
import SiteLogo from '@shared/ui/logo/SiteLogo.vue'

const props = defineProps<{
  title: string
  textOne: string
  textTwo: string
  textThree: string
  backgroundImage: string | null
  squareImage: string | null
  imageAlt: string
}>()

const backdropStyle = computed(() => props.backgroundImage
  ? { backgroundImage: `url('${props.backgroundImage}')` }
  : undefined)
</script>

<template>
  <section id="interview" class="min-h-svh bg-bg pt-36 lg:pt-[180px]">
    <div
      class="relative mb-36 h-[clamp(420px,50svh,620px)] bg-border-strong bg-cover bg-center lg:mb-[170px]"
      :style="backdropStyle"
    >
      <div class="absolute bottom-0 left-1/2 aspect-square w-[min(72vw,420px)] -translate-x-1/2 translate-y-[120px] overflow-hidden bg-text-muted lg:w-[min(420px,28vw)]">
        <img
          v-if="squareImage"
          :src="squareImage"
          :alt="imageAlt"
          class="h-full w-full object-cover"
        >
      </div>
    </div>

    <div class="mx-auto w-full max-w-[1920px] px-5 pb-24 pt-10 text-center sm:px-6 lg:px-10 lg:pb-[116px]">
      <h2 class="mx-auto max-w-[980px] font-display text-[clamp(48px,4.17vw,80px)] font-black uppercase leading-[0.92] tracking-[-0.03em] text-text">
        {{ title }}
      </h2>

      <p class="mx-auto mt-6 w-[min(520px,100%)] whitespace-pre-line font-sans text-base leading-4 text-text lg:w-[min(520px,42vw)]">
        {{ textOne }}
      </p>

      <div class="mt-16 grid items-end gap-7 text-left lg:mt-[88px] lg:grid-cols-[1fr_auto_1fr] lg:gap-20">
        <p class="m-0 max-w-[420px] whitespace-pre-line font-sans text-base leading-4 text-text">
          {{ textTwo }}
        </p>

        <NuxtLink
          :to="ROUTES.LANDING"
          class="block w-[88px] leading-none"
          aria-label="Кто здесь главный?"
        >
          <SiteLogo class="h-auto w-full" />
        </NuxtLink>

        <p class="m-0 max-w-[420px] justify-self-start whitespace-pre-line font-sans text-base leading-4 text-text lg:justify-self-end">
          {{ textThree }}
        </p>
      </div>
    </div>
  </section>
</template>
