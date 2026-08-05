<script setup lang="ts">
import type { ShootingFaqItem } from '@features/shooting-request/model/shooting-page.types'

defineProps<{
  title: string
  items: ShootingFaqItem[]
}>()
</script>

<template>
  <section class="bg-[#f7f7f4] px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
    <div class="mx-auto flex w-full max-w-5xl flex-col gap-8">
      <h2 class="font-display text-[clamp(3rem,8vw,6rem)] font-black uppercase leading-[0.88] tracking-[-0.04em] text-text">
        {{ title }}
      </h2>

      <div class="grid gap-4">
        <details
          v-for="(item, index) in items"
          :key="`${index}-${item.question}`"
          class="group overflow-hidden rounded-[26px] border border-black/10 bg-surface shadow-[0_20px_52px_rgba(7,7,7,0.05)]"
        >
          <summary class="flex cursor-pointer list-none items-start gap-4 px-6 py-5 sm:px-7">
            <span class="text-xs font-medium uppercase tracking-[0.16em] text-accent sm:text-sm">
              [ {{ String(index + 1).padStart(2, '0') }} ]
            </span>
            <span class="flex-1 text-base font-bold uppercase leading-6 text-text sm:text-lg">
              {{ item.question }}
            </span>
            <span class="text-xl leading-none text-text transition-transform group-open:rotate-45">
              +
            </span>
          </summary>
          <div class="px-6 pb-6 sm:px-7">
            <p class="max-w-[52rem] whitespace-pre-line text-sm leading-6 text-text/76 sm:text-base">
              {{ item.answer }}
            </p>
          </div>
        </details>
      </div>
    </div>
  </section>
</template>
