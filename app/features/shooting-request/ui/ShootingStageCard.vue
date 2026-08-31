<script setup lang="ts">
import type { ShootingStageItem } from '@features/shooting-request/model/shooting-page.types'

defineProps<{
  stage: ShootingStageItem
  variant: 'summary' | 'detail'
}>()
</script>

<template>
  <article
    class="pinned-portrait-item grid snap-center border border-border p-5 md:snap-none md:p-6"
    :class="variant === 'summary'
      ? 'grid-rows-[auto_1fr_auto] bg-surface/50 text-text backdrop-blur-[6px] md:mt-20'
      : 'grid-rows-[auto_1fr] bg-accent text-text-on-accent'"
  >
    <template v-if="variant === 'summary'">
      <span class="font-sans text-base leading-4">[ {{ stage.index }} ]</span>
      <strong class="min-w-0 self-end font-sans text-[22px] font-bold uppercase leading-[1.05] tracking-[-0.6px] sm:text-[26px] sm:leading-7 md:text-[30px] md:leading-8 md:tracking-[-1.25px]">
        {{ stage.title }}
      </strong>
      <small class="ml-6 min-w-0 font-sans text-[22px] font-bold uppercase leading-[1.05] tracking-[-0.6px] sm:ml-8 sm:text-[26px] sm:leading-7 md:ml-10 md:text-[30px] md:leading-8 md:tracking-[-1.25px]">
        {{ stage.subtitle }}
      </small>
    </template>

    <template v-else>
      <span class="font-sans text-base leading-4">{{ stage.eyebrow }}</span>
      <p class="min-w-0 max-w-[94%] self-end whitespace-pre-line font-sans text-base leading-4 [overflow-wrap:anywhere]">
        {{ stage.description }}
      </p>
    </template>
  </article>
</template>
