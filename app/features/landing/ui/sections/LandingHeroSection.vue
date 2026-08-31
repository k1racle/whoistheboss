<script setup lang="ts">
import { protectPrepositions } from '@shared/lib/typography'
import FullPage from '@shared/ui/page/FullPage.vue'
import { ROUTES } from '@shared/navigation'

const props = withDefaults(defineProps<{
  title: string
  staggeredLines?: boolean
  brandLockup?: boolean
  trademarkText?: string
}>(), {
  staggeredLines: false,
  brandLockup: false,
  trademarkText: '',
})

const protectedTitle = computed(() => protectPrepositions(props.title))
const titleLines = computed(() => protectedTitle.value.split('\n'))
</script>

<template>
  <FullPage id="top" next-label="Перейти к следующей секции">
    <div class="mx-auto flex w-full max-w-[1920px] flex-1 items-end px-4 pb-0 sm:px-6  lg:px-10 ">
      <div class="flex w-full flex-col items-start justify-start">
        <template v-if="brandLockup">
          <h1 class="w-full">
            <span class="sr-only">{{ protectedTitle.replace(/\n/g, ' ') }}</span>
            <img
              src="/images/landing/brand-lockup.svg"
              alt=""
              width="1856"
              height="863"
              class="block h-auto w-[125%] max-w-none sm:w-full"
              aria-hidden="true"
              draggable="false"
            >
          </h1>
          <NuxtLink
            v-if="trademarkText"
            :to="ROUTES.TRADEMARK"
            class="-mt-2 mb-4 whitespace-pre-line font-sans text-base uppercase leading-[18px] text-text transition-colors hover:text-accent sm:-mt-3 sm:mb-6"
          >
            {{ trademarkText }}
          </NuxtLink>
        </template>
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
