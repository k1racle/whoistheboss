<script setup lang="ts">
import ArrowMark from '@shared/ui/icons/ArrowMark.vue'

const props = withDefaults(defineProps<{
  title: string
  text: string
  asideText?: string
  bottomText?: string
  image: string | null
  imageAlt: string
  imageAspect?: 'portrait' | 'wide'
  buttonHref?: string
  buttonLabel?: string
}>(), {
  asideText: '',
  bottomText: '',
  imageAspect: 'portrait',
  buttonHref: '#interviews',
  buttonLabel: 'СМОТРЕТЬ ИНТЕРВЬЮ',
})

const titleLines = computed(() => props.title.split(/\r?\n/).map(line => line.trim()).filter(Boolean))
</script>

<template>
  <section class="bg-bg py-[120px] max-lg:px-5 max-lg:py-20">
    <div class="mx-auto grid w-[min(calc(100%_-_80px),1920px)] grid-cols-[minmax(0,60%)_minmax(0,40%)] items-start gap-10 max-lg:w-full max-lg:grid-cols-1">
      <div class="flex min-h-full flex-col items-start">
        <h2 class="m-0 font-display text-[80px] font-black uppercase leading-[80px] tracking-[-0.03em] text-text max-lg:text-[clamp(43px,10vw,74px)] max-lg:leading-[0.92]">
          <span
            v-for="(line, index) in titleLines"
            :key="`${line}-${index}`"
            class="block"
            :class="{ 'pl-80 max-lg:pl-40 max-md:pl-0': index === 2 }"
          >
            {{ line }}
          </span>
        </h2>

        <p v-if="text" class="mt-12 w-[min(100%,47rem)] whitespace-pre-line font-sans text-base leading-4 text-text">
          {{ text }}
        </p>

        <div class="mt-auto flex items-end gap-[120px] pt-10 max-lg:flex-col max-lg:items-start max-lg:gap-6">
          <a
            :href="buttonHref"
            class="inline-flex min-h-[42px] shrink-0 items-center justify-center gap-3 border border-accent bg-accent px-4 py-2 font-sans text-base uppercase leading-4 text-text-on-accent no-underline max-md:w-full"
          >
            {{ buttonLabel }}
            <ArrowMark />
          </a>
          <p v-if="asideText" class="m-0 w-[min(520px,100%)] whitespace-pre-line font-sans text-base leading-4 text-text">
            {{ asideText }}
          </p>
        </div>
      </div>

      <div class="flex min-h-full flex-col items-start gap-10">
        <img
          v-if="image"
          :src="image"
          :alt="imageAlt"
          class="w-full object-cover"
          :class="{ 'aspect-video': imageAspect === 'wide' }"
        >
        <p v-if="bottomText" class="mt-auto whitespace-pre-line font-sans text-base leading-4 text-text">
          {{ bottomText }}
        </p>
      </div>
    </div>
  </section>
</template>
