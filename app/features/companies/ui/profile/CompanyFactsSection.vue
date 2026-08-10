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
</script>

<template>
  <section class="bg-bg px-5 py-[90px] sm:px-6 lg:px-10 lg:py-[130px]">
    <div class="mx-auto grid w-full max-w-[1920px] grid-cols-1 gap-10 lg:grid-cols-[minmax(0,60%)_minmax(0,40%)]">
      <div>
        <SectionTitle class="m-0 whitespace-pre-line">
          {{ protectedTitle }}
        </SectionTitle>
        <p v-if="subtitle" class="mt-5 max-w-[760px] whitespace-pre-line font-sans text-base font-bold uppercase leading-4 text-text">
          {{ subtitle }}
        </p>
        <div class="mt-10 aspect-video overflow-hidden bg-border-strong">
          <img
            v-if="image"
            :src="image"
            :alt="imageAlt"
            class="h-full w-full object-cover"
          >
        </div>
      </div>

      <div class="flex flex-col gap-8 lg:pt-4">
        <p class="m-0 whitespace-pre-line font-sans text-base leading-4 text-text">
          {{ textOne }}
        </p>
        <p class="m-0 whitespace-pre-line font-sans text-base leading-4 text-text lg:mt-auto">
          {{ textTwo }}
        </p>
      </div>
    </div>
  </section>
</template>
