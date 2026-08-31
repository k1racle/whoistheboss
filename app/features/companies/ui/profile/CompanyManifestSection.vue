<script setup lang="ts">
import { protectPrepositions } from '@shared/lib/typography'
import SectionTitle from '@shared/ui/page/SectionTitle.vue'

const props = defineProps<{
  title: string
  textOne: string
  textTwo: string
  textThree: string
  backgroundImage: string | null
  squareImage: string | null
  imageAlt: string
}>()

const protectedTitle = computed(() => protectPrepositions(props.title))
const protectedTextOne = computed(() => protectPrepositions(props.textOne))
const protectedTextTwo = computed(() => protectPrepositions(props.textTwo))
const protectedTextThree = computed(() => protectPrepositions(props.textThree))
</script>

<template>
  <section id="interview" class="min-h-svh bg-bg pt-36 lg:pt-[160px]">
    <div
      class="relative mb-36 h-[628px] bg-border-strong bg-cover bg-center lg:mb-[170px]"
    >
      <NuxtImg
        v-if="backgroundImage"
        :src="backgroundImage"
        alt=""
        sizes="320:100vw 768:100vw lg:100vw 2000:1920px 3000:2560px 4000:3840px"
        format="webp"
        loading="lazy"
        decoding="async"
        class="absolute inset-0 h-full w-full object-cover"
      />
      <div class="absolute left-1/2 top-1/2 aspect-square w-[min(72vw,420px)] -translate-x-1/2 overflow-hidden bg-text-muted lg:w-[min(420px,28vw)]">
        <NuxtImg
          v-if="squareImage"
          :src="squareImage"
          :alt="imageAlt"
          sizes="320:72vw 480:72vw sm:420px lg:28vw 1536:420px"
          format="webp"
          loading="lazy"
          decoding="async"
          class="h-full w-full object-cover"
        />
      </div>
    </div>

    <div class="mx-auto w-full max-w-[1920px] px-5 pb-24 pt-10 text-center sm:px-6 lg:px-10 lg:pb-[116px]">
      <SectionTitle class="mx-auto max-w-[980px]">
        {{ protectedTitle }}
      </SectionTitle>

      <p class="mx-auto mt-6 w-[min(520px,100%)] whitespace-pre-line font-sans text-base leading-4 text-text lg:w-[min(520px,42vw)]">
        {{ protectedTextOne }}
      </p>

      <div class="mt-16 grid items-end gap-7 text-left lg:mt-[88px] lg:grid-cols-2 lg:gap-20">
        <p class="m-0 max-w-[420px] whitespace-pre-line font-sans text-base leading-4 text-text">
          {{ protectedTextTwo }}
        </p>

        <p class="m-0 max-w-[420px] justify-self-start whitespace-pre-line font-sans text-base leading-4 text-text lg:justify-self-end lg:text-right">
          {{ protectedTextThree }}
        </p>
      </div>
    </div>
  </section>
</template>
