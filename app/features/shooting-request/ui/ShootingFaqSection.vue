<script setup lang="ts">
import type { ShootingFaqItem } from '@features/shooting-request/model/shooting-page.types'

defineProps<{
  title: string
  items: ShootingFaqItem[]
}>()
</script>

<template>
  <section class="bg-bg px-4 py-12 sm:px-6 lg:px-10 lg:py-16">
    <div class="mx-auto flex w-full max-w-[1100px] flex-col gap-8">
      <h2 class="font-display text-[clamp(3rem,8vw,6rem)] font-black uppercase leading-[0.88] tracking-[-0.04em] text-text">
        {{ title }}
      </h2>

      <div class="grid gap-3">
        <details
          v-for="(item, index) in items"
          :key="`${index}-${item.question}`"
          class="group border border-border-strong bg-surface"
        >
          <summary class="flex cursor-pointer list-none items-start gap-4 px-5 py-5 sm:px-6">
            <span class="font-sans text-xs uppercase leading-4 tracking-[0.16em] text-accent sm:text-sm">
              [ {{ String(index + 1).padStart(2, '0') }} ]
            </span>
            <span class="flex-1 font-sans text-base font-bold uppercase leading-6 text-text sm:text-lg">
              {{ item.question }}
            </span>
            <span class="font-sans text-xl leading-none text-text transition-transform group-open:rotate-45">
              +
            </span>
          </summary>
          <div class="px-5 pb-5 sm:px-6 sm:pb-6">
            <p class="max-w-[52rem] font-sans text-sm leading-6 text-text/80 sm:text-base whitespace-pre-line">
              {{ item.answer }}
            </p>
          </div>
        </details>
      </div>
    </div>
  </section>
</template>
