<script setup lang="ts">
import { protectPrepositions } from '@shared/lib/typography'
import FullPage from '@shared/ui/page/FullPage.vue'

const props = defineProps<{
  title: string
}>()

const protectedTitle = computed(() => protectPrepositions(props.title))
</script>

<template>
  <FullPage id="top" next-label="Перейти к следующей секции">
    <div class="mx-auto flex w-full max-w-[1920px] flex-1 items-end px-4 pb-0 sm:px-6  lg:px-10 ">
      <div class="flex w-full justify-start">
        <h1 class="whitespace-pre-line text-left font-display text-[clamp(80px,20vw,320px)] font-black uppercase leading-[0.8] tracking-[-0.03em] text-accent">
          {{ protectedTitle }}
        </h1>
      </div>
    </div>
  </FullPage>
</template>
