<script setup lang="ts">
import type { ShootingStageItem } from '@features/shooting-request/model/shooting-page.types'

defineProps<{
  stage: ShootingStageItem
  variant: 'summary' | 'detail'
}>()
</script>

<template>
  <article
    class="grid h-[28rem] min-w-[85vw] shrink-0 snap-center border border-border p-5 sm:min-w-[420px] md:h-[42rem] md:w-[min(440px,88vw)] md:min-w-0 md:snap-none md:p-6"
    :class="variant === 'summary'
      ? 'grid-rows-[auto_1fr_auto] bg-surface/50 text-text backdrop-blur-[6px] md:mt-20'
      : 'grid-rows-[auto_1fr] bg-accent text-text-on-accent'"
  >
    <template v-if="variant === 'summary'">
      <span class="font-sans text-base leading-4">[ {{ stage.index }} ]</span>
      <strong class="self-end font-sans text-[30px] font-bold uppercase leading-8 tracking-[-1.25px]">
        {{ stage.title }}
      </strong>
      <small class="ml-10 font-sans text-[30px] font-bold uppercase leading-8 tracking-[-1.25px]">
        {{ stage.subtitle }}
      </small>
    </template>

    <template v-else>
      <span class="font-sans text-base leading-4">{{ stage.eyebrow }}</span>
      <p class="max-w-[94%] self-end font-sans text-base leading-4">
        {{ stage.description }}
      </p>
    </template>
  </article>
</template>
