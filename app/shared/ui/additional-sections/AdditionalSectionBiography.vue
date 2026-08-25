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
  <section class="bg-bg py-14 max-lg:px-5 2xl:py-20">
    <div class="mx-auto grid w-[min(calc(100%_-_80px),1920px)] grid-cols-[minmax(0,62.5rem)_minmax(17.5rem,31.25rem)] justify-between gap-[clamp(2rem,4vw,6rem)] max-lg:w-full max-lg:grid-cols-1 max-lg:gap-10">
      <div class="flex min-w-0 flex-col items-start">
        <p v-if="eyebrow" class="m-0 whitespace-pre-line font-display text-[80px] font-black uppercase leading-[80px] tracking-[-0.03em] text-text max-lg:text-[clamp(42px,10vw,72px)] max-lg:leading-[0.88]">
          {{ eyebrow }}
        </p>
        <h2 class="m-0 whitespace-pre-line font-display text-[80px] font-black uppercase leading-[80px] tracking-[-0.03em] text-text max-lg:text-[clamp(42px,10vw,72px)] max-lg:leading-[0.88]">
          {{ title }}
        </h2>
        <ButtonLink
          :to="buttonHref"
          arrow="mark"
          size="story"
          variant="invert"
          :emphasis="false"
          class="mt-7 max-md:w-full"
        >
          {{ buttonLabel }}
        </ButtonLink>
        <NuxtImg
          v-if="image"
          :src="image"
          :alt="imageAlt"
          sizes="320:100vw 480:100vw sm:100vw lg:1000px"
          format="webp"
          loading="lazy"
          decoding="async"
          class="mt-7 aspect-[20/11] w-full bg-[#dedede] object-contain"
        />
      </div>

      <div class="flex min-h-full min-w-0 flex-col gap-[clamp(1.5rem,3vw,3.125rem)] pt-2  max-lg:gap-5 max-lg:p-0">
        <article
          v-for="(block, index) in blocks"
          :key="index"
          class="w-full"
          :class="{ 'mt-auto': index === blocks.length - 1 }"
        >
          <p class="m-0 whitespace-pre-line font-sans text-base leading-[1.15] text-text">
            {{ block }}
          </p>
        </article>
      </div>
    </div>
  </section>
</template>
