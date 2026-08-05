<script setup lang="ts">
import ArrowMark from '@shared/ui/icons/ArrowMark.vue'

defineProps<{
  eyebrow: string
  title: string
  image: string | null
  imageAlt: string
  blocks: string[]
}>()
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
        <a
          href="#interviews"
          class="inline-flex min-h-[42px] items-center justify-center gap-3 border border-accent bg-accent px-4 py-2 font-sans text-base uppercase leading-4 text-text-on-accent no-underline transition-colors duration-200 hover:border-text hover:bg-surface hover:text-text focus-visible:border-text focus-visible:bg-surface focus-visible:text-text max-md:w-full"
        >
          СМОТРЕТЬ ИНТЕРВЬЮ
          <ArrowMark />
        </a>
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
