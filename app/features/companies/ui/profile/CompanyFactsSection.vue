<script setup lang="ts">
import { protectPrepositions } from '@shared/lib/typography'
import SectionTitle from '@shared/ui/page/SectionTitle.vue'

const props = defineProps<{
  title: string
  subtitle: string
  textOne: string
  textTwo: string
  image: string | null
  imageAlt: string
}>()

const protectedTitle = computed(() => protectPrepositions(props.title))
const protectedSubtitle = computed(() => protectPrepositions(props.subtitle))
const protectedTextOne = computed(() => protectPrepositions(props.textOne))
const protectedTextTwo = computed(() => protectPrepositions(props.textTwo))
</script>

<template>
  <section class="bg-bg px-5 py-[90px] sm:px-6 lg:px-10 lg:py-[130px]">
    <div class="mx-auto grid w-full max-w-[1920px] grid-cols-1 gap-10 lg:grid-cols-[minmax(0,60%)_minmax(0,40%)]">
      <div>
        <SectionTitle class="m-0 whitespace-pre-line">
          {{ protectedTitle }}
        </SectionTitle>
        <p v-if="subtitle" class="mt-5 max-w-[760px] whitespace-pre-line font-sans text-base font-bold uppercase leading-4 text-text">
          {{ protectedSubtitle }}
        </p>
        <div class="mt-10 aspect-video overflow-hidden bg-border-strong">
          <NuxtImg
            v-if="image"
            :src="image"
            :alt="imageAlt"
            sizes="320:100vw 480:100vw sm:100vw lg:60vw 2000:1100px"
            format="webp"
            loading="lazy"
            decoding="async"
            class="h-full w-full object-cover"
          />
        </div>
      </div>

      <div class="flex flex-col gap-8 lg:pt-4">
        <p class="m-0 whitespace-pre-line font-sans text-base leading-4 text-text">
          {{ protectedTextOne }}
        </p>
        <p class="m-0 whitespace-pre-line font-sans text-base leading-4 text-text lg:mt-auto">
          {{ protectedTextTwo }}
        </p>
      </div>
    </div>
  </section>
</template>
