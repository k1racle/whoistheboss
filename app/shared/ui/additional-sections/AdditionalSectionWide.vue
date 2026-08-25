<script setup lang="ts">
const props = defineProps<{
  title: string
  text: string
  bottomText: string
  image: string | null
  imageAlt: string
}>()

const titleLines = computed(() => props.title.split(/\r?\n/).map(line => line.trim()).filter(Boolean))
</script>

<template>
  <section class="bg-bg py-14 max-lg:px-5 lg:py-20">
    <div class="mx-auto grid w-[min(calc(100%_-_80px),1920px)] grid-cols-[minmax(0,60%)_minmax(0,40%)] items-stretch gap-10 max-lg:w-full max-lg:grid-cols-1">
      <div class="flex min-h-full flex-col items-start">
        <h2 class="m-0 font-display text-[80px] font-black uppercase leading-[80px] tracking-[-0.03em] text-text max-lg:text-[clamp(43px,10vw,74px)] max-lg:leading-[0.92]">
          <span
            v-for="(line, index) in titleLines"
            :key="`${line}-${index}`"
            class="block"
          >
            {{ line }}
          </span>
        </h2>

        <NuxtImg
          v-if="image"
          :src="image"
          :alt="imageAlt"
          sizes="320:100vw 480:100vw sm:100vw lg:60vw 1536:832px"
          format="webp"
          loading="lazy"
          decoding="async"
          class="aspect-video w-full object-cover lg:w-[90%]"
        />
      </div>

      <div class="flex min-h-full flex-col gap-10 pt-4">
        <p v-if="text" class="m-0 whitespace-pre-line font-sans text-base leading-4 text-text">
          {{ text }}
        </p>
        <p v-if="bottomText" class="mt-auto whitespace-pre-line font-sans text-base leading-4 text-text">
          {{ bottomText }}
        </p>
      </div>
    </div>
  </section>
</template>
