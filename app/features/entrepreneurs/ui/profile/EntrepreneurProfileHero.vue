<script setup lang="ts">
import type { EntrepreneurDetailData } from '@features/entrepreneurs/model/entrepreneur.types'

const props = defineProps<{
  entrepreneur: EntrepreneurDetailData
}>()

const heroMarqueeText = computed(() =>
  props.entrepreneur.heroMarquee || `${props.entrepreneur.name} • ${props.entrepreneur.title} • КТО ЗДЕСЬ ГЛАВНЫЙ`,
)
</script>

<template>
  <section id="top" class="relative min-h-svh overflow-hidden bg-bg">
    <div class="mx-auto flex min-h-[calc(100svh-86px)] w-[min(calc(100%_-_80px),1920px)] items-end max-lg:block max-lg:min-h-[calc(100svh-86px)] max-lg:w-[calc(100%_-_40px)] max-lg:pt-[84px]">
      <div class="flex w-full flex-col max-lg:min-h-[calc(100svh-170px)] max-lg:justify-end max-lg:gap-3">
        <div class="mb-[-4.65rem] flex w-full items-end justify-between gap-10 max-lg:mb-0 max-lg:block">
          <span class="font-display text-[clamp(120px,16.6667vw,320px)] font-black uppercase leading-none tracking-[-0.03em] text-accent max-lg:text-[clamp(54px,15vw,86px)] max-lg:leading-[0.88]">
            WHO'S THE
          </span>
          <p
            v-if="entrepreneur.heroRightTeaser || entrepreneur.quote"
            class="w-[min(500px,32vw)] max-w-[500px] self-center font-sans text-base font-bold uppercase leading-4 text-text max-lg:mt-2 max-lg:w-full max-lg:max-w-none max-lg:text-left max-lg:text-[13px] max-lg:leading-[14px]"
          >
            {{ entrepreneur.heroRightTeaser || entrepreneur.quote }}
          </p>
        </div>

        <div class="mb-[-5.05rem] flex w-full items-end justify-between gap-10 max-lg:mb-0 max-lg:block">
          <p
            v-if="entrepreneur.heroLeftTeaser || entrepreneur.title"
            class="w-[min(500px,32vw)] max-w-[500px] self-center text-right font-sans text-base font-bold uppercase leading-4 text-text max-lg:mt-2 max-lg:w-full max-lg:max-w-none max-lg:text-left max-lg:text-[13px] max-lg:leading-[14px]"
          >
            {{ entrepreneur.heroLeftTeaser || entrepreneur.title }}
          </p>
          <h1 class="m-0 text-right font-display text-[clamp(120px,16.6667vw,320px)] font-black uppercase leading-none tracking-[-0.03em] text-accent max-lg:text-left max-lg:text-[clamp(62px,18vw,106px)] max-lg:leading-[0.88]">
            {{ entrepreneur.heroLastName }}
          </h1>
        </div>

        <div class="flex w-full items-end justify-between gap-10 max-lg:block">
          <h1 class="m-0 text-left font-display text-[clamp(120px,16.6667vw,320px)] font-black uppercase leading-none tracking-[-0.03em] text-accent max-lg:text-[clamp(62px,18vw,106px)] max-lg:leading-[0.88]">
            {{ entrepreneur.heroFirstName }}
          </h1>
          <p
            v-if="entrepreneur.heroBottomRightTeaser || entrepreneur.title"
            class="w-[min(500px,32vw)] max-w-[500px] self-center font-sans text-base font-bold uppercase leading-4 text-text max-lg:mt-2 max-lg:w-full max-lg:max-w-none max-lg:text-left max-lg:text-[13px] max-lg:leading-[14px]"
          >
            {{ entrepreneur.heroBottomRightTeaser || entrepreneur.title }}
          </p>
        </div>
      </div>
    </div>

    <div class="overflow-hidden border-y border-accent bg-accent py-3.5" aria-label="О герое">
      <div class="flex w-max animate-[profileHeroMarquee_72s_linear_infinite] max-lg:animate-[profileHeroMarquee_36s_linear_infinite]">
        <div v-for="group in 2" :key="group" class="flex items-center">
          <span
            v-for="index in 4"
            :key="`${group}-${index}`"
            class="whitespace-nowrap px-8 font-display text-[80px] font-black uppercase leading-[80px] tracking-[-0.03em] text-text-on-accent max-lg:px-5 max-lg:text-2xl max-lg:leading-7"
          >
            {{ heroMarqueeText }}
          </span>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
@keyframes profileHeroMarquee {
  to {
    transform: translateX(-50%);
  }
}
</style>
