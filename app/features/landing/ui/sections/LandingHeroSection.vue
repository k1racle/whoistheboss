<script setup lang="ts">
import { protectPrepositions } from '@shared/lib/typography'
import FullPage from '@shared/ui/page/FullPage.vue'

const props = withDefaults(defineProps<{
  title: string
  staggeredLines?: boolean
  brandLockup?: boolean
}>(), {
  staggeredLines: false,
  brandLockup: false,
})

const protectedTitle = computed(() => protectPrepositions(props.title))
const titleLines = computed(() => protectedTitle.value.split('\n'))
const brandLabel = computed(() => titleLines.value[0] || '')
const brandTitleLines = computed(() => titleLines.value.slice(1))
</script>

<template>
  <FullPage id="top" next-label="Перейти к следующей секции">
    <div class="mx-auto flex w-full max-w-[1920px] flex-1 items-end px-4 pb-0 sm:px-6  lg:px-10 ">
      <div class="flex w-full justify-start">
        <h1
          v-if="brandLockup"
          class="grid w-fit max-w-full grid-cols-[max-content_max-content] grid-rows-2 items-stretch text-left font-display text-[clamp(68px,20vw,320px)] font-black uppercase leading-[0.8] tracking-[-0.03em] text-accent"
        >
          <span
            v-for="(line, index) in brandTitleLines"
            :key="`${index}-${line}`"
            class="col-start-1 block whitespace-nowrap"
            :class="index === 0 ? 'row-start-1' : 'row-start-2 text-[0.963em]'"
          >
            {{ line }}
          </span>
          <span
            class="col-start-2 row-span-2 row-start-1 ml-[0.06em] -translate-y-[0.303em] scale-y-[0.984] self-center whitespace-nowrap text-[0.34em] leading-none tracking-[-0.02em] [text-orientation:mixed] [writing-mode:vertical-rl] rotate-180"
          >
            {{ brandLabel }}
          </span>
        </h1>
        <h1
          v-else-if="staggeredLines"
          class="flex w-full flex-col text-left font-display text-[clamp(80px,20vw,320px)] font-black uppercase leading-[0.88] tracking-[-0.03em] text-accent"
        >
          <span
            v-for="(line, index) in titleLines"
            :key="`${index}-${line}`"
            class="block whitespace-nowrap"
            :class="index === 1 ? 'self-end text-right' : ''"
          >
            {{ line }}
          </span>
        </h1>
        <h1
          v-else
          class="whitespace-pre-line text-left font-display text-[clamp(80px,20vw,320px)] font-black uppercase leading-[0.8] tracking-[-0.03em] text-accent"
        >
          {{ protectedTitle }}
        </h1>
      </div>
    </div>
  </FullPage>
</template>
