<script setup lang="ts">
import ButtonLink from '@shared/ui/buttons/ButtonLink.vue'

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
  <section class="bg-bg py-14 max-lg:px-5 lg:py-20">
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
          <ButtonLink
            :to="buttonHref"
            arrow="mark"
            size="story"
            variant="flat"
            :emphasis="false"
            class="shrink-0 border border-accent max-md:w-full"
          >
            {{ buttonLabel }}
          </ButtonLink>
          <p v-if="asideText" class="m-0 w-[min(520px,100%)] whitespace-pre-line font-sans text-base leading-4 text-text">
            {{ asideText }}
          </p>
        </div>
      </div>

      <div class="flex min-h-full flex-col items-end gap-10">
        <NuxtImg
          v-if="image"
          :src="image"
          :alt="imageAlt"
          sizes="320:100vw 480:100vw sm:100vw lg:40vw 2000:728px"
          format="webp"
          loading="lazy"
          decoding="async"
          class="w-full object-contain object-right max-lg:h-auto lg:h-[800px]"
          :class="{ 'aspect-video': imageAspect === 'wide' }"
        />
        <p v-if="bottomText" class="mt-auto whitespace-pre-line font-sans text-base leading-4 text-text">
          {{ bottomText }}
        </p>
      </div>
    </div>
  </section>
</template>
