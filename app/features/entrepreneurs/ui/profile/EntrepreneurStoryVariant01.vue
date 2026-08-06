<script setup lang="ts">
import ButtonLink from '@shared/ui/buttons/ButtonLink.vue'

withDefaults(defineProps<{
  eyebrow: string
  title: string
  image: string | null
  imageAlt: string
  blocks: string[]
  buttonHref?: string
  buttonLabel?: string
}>(), {
  buttonHref: '#interviews',
  buttonLabel: 'СМОТРЕТЬ ИНТЕРВЬЮ',
})
</script>

<template>
  <section class="min-h-svh bg-bg pb-10 pt-[320px] max-lg:min-h-0 max-lg:px-5 max-lg:pb-8 max-lg:pt-40">
    <div class="mx-auto grid w-[min(calc(100%_-_80px),1920px)] grid-cols-[minmax(0,60%)_minmax(0,40%)] max-lg:w-full max-lg:grid-cols-1 max-lg:gap-10">
      <div class="flex flex-col items-start gap-7">
        <p class="m-0 font-display text-[80px] font-black uppercase leading-[80px] tracking-[-0.03em] text-text max-lg:text-[clamp(42px,10vw,72px)] max-lg:leading-[0.88]">
          {{ eyebrow }}
        </p>
        <h2 class="m-0 flex flex-wrap gap-x-1.5 font-display text-[80px] font-black uppercase leading-[80px] tracking-[-0.03em] text-text max-lg:text-[clamp(42px,10vw,72px)] max-lg:leading-[0.88]">
          <span>WHO'S THE</span>
          <span>{{ title }}?</span>
        </h2>
        <ButtonLink
          :to="buttonHref"
          arrow="mark"
          size="story"
          variant="invert"
          :emphasis="false"
          class="max-md:w-full"
        >
          {{ buttonLabel }}
        </ButtonLink>
        <img v-if="image" :src="image" :alt="imageAlt" class="mt-4 w-[min(100%,33rem)] object-cover">
      </div>

      <div class="flex flex-col gap-0 pt-4 pl-[200px] max-lg:gap-5 max-lg:p-0">
        <article
          v-for="(block, index) in blocks"
          :key="index"
          class="w-full"
          :class="{ 'mt-[50px] max-lg:mt-0': index === 1, 'mt-auto max-lg:mt-0': index === 2 }"
        >
          <p class="m-0 whitespace-pre-line font-sans text-base leading-4 text-text">
            {{ block }}
          </p>
        </article>
      </div>
    </div>
  </section>
</template>
