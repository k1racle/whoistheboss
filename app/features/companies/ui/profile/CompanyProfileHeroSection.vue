<script setup lang="ts">
import TextMarquee from '@shared/ui/marquee/TextMarquee.vue'

defineProps<{
  titleTop: string
  titleBottom: string
  teaser: string
  marquee: string
  name: string
}>()
</script>

<template>
  <section id="top" class="flex min-h-svh flex-col overflow-hidden bg-bg">
    <div class="mx-auto flex w-full max-w-[1920px] flex-1 items-end px-5 pb-8 pt-24 sm:px-6 lg:px-10 lg:pb-[72px]">
      <div class="relative flex w-full flex-col">
        <p
          v-if="teaser"
          class="order-first mb-5 w-[min(500px,100%)] font-sans text-[13px] font-bold uppercase leading-[14px] text-text lg:absolute lg:bottom-[clamp(20px,1.8vw,35px)] lg:right-[51%] lg:order-none lg:mb-0 lg:w-[min(500px,32vw)] lg:text-right lg:text-base lg:leading-4"
        >
          {{ teaser }}
        </p>

        <h1 class="m-0 flex w-full flex-col font-display text-[clamp(44px,13vw,58px)] font-black uppercase leading-[0.84] tracking-[-0.03em] text-accent sm:text-[clamp(72px,20vw,160px)] lg:text-[clamp(112px,15.6vw,300px)] lg:leading-[0.76]">
          <span class="self-start">{{ titleTop }}</span>
          <span v-if="titleBottom" class="self-end text-right">{{ titleBottom }}</span>
        </h1>
      </div>
    </div>

    <TextMarquee
      :text="marquee"
      :duration-seconds="48"
      :aria-label="name"
    />
  </section>
</template>
