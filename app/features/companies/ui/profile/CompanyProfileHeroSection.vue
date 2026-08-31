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
    <div class="mx-auto flex w-full max-w-[1920px] flex-1 items-end px-5 pb-8 pt-24 sm:px-6 lg:px-10 lg:pb-6">
      <hgroup class="flex w-full flex-col lg:grid lg:grid-cols-[minmax(0,1fr)_max-content] lg:items-end lg:gap-x-[clamp(20px,2vw,40px)]">
        <h1 class="contents font-display text-[clamp(80px,20vw,320px)] font-black uppercase leading-[0.84] tracking-[-0.03em] text-accent lg:leading-[0.76]">
          <span class="order-2 self-start lg:col-span-2 lg:row-start-1">{{ titleTop }}</span>
          <span v-if="titleBottom" class="order-3 self-end text-right lg:col-start-2 lg:row-start-2 lg:justify-self-end">{{ titleBottom }}</span>
        </h1>

        <p
          v-if="teaser"
          class="order-1 mb-5 w-[min(500px,100%)] whitespace-pre-line font-sans text-[13px] font-bold uppercase leading-[14px] text-text lg:col-start-1 lg:row-start-2 lg:mb-0 lg:self-center lg:justify-self-end lg:text-right lg:text-base lg:leading-4"
        >
          {{ teaser }}
        </p>
      </hgroup>
    </div>

    <TextMarquee
      :text="marquee"
      :duration-seconds="48"
      :aria-label="name"
    />
  </section>
</template>
