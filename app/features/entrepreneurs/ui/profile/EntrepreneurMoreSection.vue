<script setup lang="ts">
import type { EntrepreneurMoreItem } from '@features/entrepreneurs/model/entrepreneur.types'

defineProps<{
  items: EntrepreneurMoreItem[]
  image: string | null
  imageAlt: string
}>()
</script>

<template>
  <section class="overflow-hidden bg-surface py-10 max-lg:px-5 max-lg:pb-20">
    <div class="relative mx-auto grid w-[min(calc(100%_-_80px),1920px)] grid-cols-[minmax(0,4fr)_minmax(0,1fr)] items-stretch gap-10 max-lg:w-full max-lg:grid-cols-1 max-lg:gap-8">
      <div class="flex min-w-0 flex-col gap-10 max-lg:gap-5">
        <div class="grid grid-cols-3 gap-10 max-lg:grid-cols-2 max-lg:gap-5 max-md:grid-cols-1">
          <template v-for="(item, index) in items.slice(0, 3)" :key="`${item.title}-${index}`">
            <NuxtLink
              v-if="item.href"
              :to="item.href"
              class="relative flex h-[min(29.0625rem,24vw)] max-h-[29.0625rem] w-full flex-col justify-end bg-accent p-5 text-text-on-accent no-underline transition-colors duration-200 hover:bg-surface hover:text-text hover:ring-1 hover:ring-inset hover:ring-text max-lg:aspect-square max-lg:h-auto max-lg:max-h-none"
            >
              <span class="absolute right-5 top-5 text-[32px] leading-none" aria-hidden="true">[↗]</span>
              <strong class="max-w-[85%] whitespace-pre-line font-sans text-[32px] font-normal uppercase leading-8 max-md:text-[22px] max-md:leading-[22px]">
                {{ item.title }}
              </strong>
            </NuxtLink>
            <div
              v-else
              class="relative flex h-[min(29.0625rem,24vw)] max-h-[29.0625rem] w-full flex-col justify-end bg-accent p-5 text-text-on-accent max-lg:aspect-square max-lg:h-auto max-lg:max-h-none"
              aria-disabled="true"
            >
              <span class="absolute right-5 top-5 text-[32px] leading-none" aria-hidden="true">[↗]</span>
              <strong class="max-w-[85%] whitespace-pre-line font-sans text-[32px] font-normal uppercase leading-8 max-md:text-[22px] max-md:leading-[22px]">
                {{ item.title }}
              </strong>
            </div>
          </template>
        </div>

        <div class="grid grid-cols-[minmax(0,1fr)_minmax(0,2.08fr)] gap-10 max-lg:grid-cols-2 max-lg:gap-5 max-md:grid-cols-1">
          <NuxtLink
            v-if="items[3]?.href"
            :to="items[3].href"
            class="relative flex h-[min(29.0625rem,24vw)] max-h-[29.0625rem] w-full flex-col justify-end bg-accent p-5 text-text-on-accent no-underline transition-colors duration-200 hover:bg-surface hover:text-text hover:ring-1 hover:ring-inset hover:ring-text max-lg:aspect-square max-lg:h-auto max-lg:max-h-none"
          >
            <span class="absolute right-5 top-5 text-[32px] leading-none" aria-hidden="true">[↗]</span>
            <strong class="max-w-[85%] whitespace-pre-line font-sans text-[32px] font-normal uppercase leading-8 max-md:text-[22px] max-md:leading-[22px]">
              {{ items[3].title }}
            </strong>
          </NuxtLink>
          <div
            v-else
            class="relative flex h-[min(29.0625rem,24vw)] max-h-[29.0625rem] w-full flex-col justify-end bg-accent p-5 text-text-on-accent max-lg:aspect-square max-lg:h-auto max-lg:max-h-none"
            aria-disabled="true"
          >
            <span class="absolute right-5 top-5 text-[32px] leading-none" aria-hidden="true">[↗]</span>
            <strong class="max-w-[85%] whitespace-pre-line font-sans text-[32px] font-normal uppercase leading-8 max-md:text-[22px] max-md:leading-[22px]">
              {{ items[3]?.title }}
            </strong>
          </div>

          <div class="h-[min(29.0625rem,24vw)] max-h-[29.0625rem] w-full overflow-hidden bg-[#d9d9d9] max-lg:col-span-full max-lg:aspect-square max-lg:h-auto max-lg:max-h-none max-md:col-auto">
            <img v-if="image" :src="image" :alt="imageAlt" class="h-full w-full object-cover">
          </div>
        </div>
      </div>

      <div class="flex h-full min-h-full items-center justify-center font-display text-[clamp(120px,15vw,290px)] font-black uppercase leading-none tracking-[-0.03em] text-text [writing-mode:vertical-rl] [transform:rotate(180deg)] max-lg:justify-end max-lg:text-right max-lg:text-[clamp(72px,12vw,112px)] max-lg:leading-[0.9] max-lg:[writing-mode:horizontal-tb] max-lg:[transform:none]" aria-hidden="true">
        БОЛЬШЕ
      </div>
    </div>
  </section>
</template>
