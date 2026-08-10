<script setup lang="ts">
import type { ShootingFaqItem } from '@features/shooting-request/model/shooting-page.types'
import { protectPrepositions } from '@shared/lib/typography'
import SectionTitle from '@shared/ui/page/SectionTitle.vue'

const props = defineProps<{
  title: string
  items: ShootingFaqItem[]
}>()

const protectedTitle = computed(() => protectPrepositions(props.title))
</script>

<template>
  <section id="faq" class="bg-bg px-4 py-20 sm:px-6 lg:px-10 lg:py-32">
    <div class="mx-auto w-full max-w-[1920px]">
      <SectionTitle>
        {{ protectedTitle }}
      </SectionTitle>

      <div class="mt-16 grid gap-2 lg:mt-28">
        <details
          v-for="(item, index) in items"
          :key="`${index}-${item.question}`"
          class="group border border-border-strong bg-surface text-text transition-colors duration-200 hover:border-accent hover:bg-accent hover:text-text-on-accent open:border-accent open:bg-accent open:text-text-on-accent"
        >
          <summary class="grid min-h-28 cursor-pointer list-none grid-cols-[64px_minmax(0,1fr)_48px] items-center gap-4 px-4 py-6 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent sm:min-h-36 sm:grid-cols-[110px_minmax(0,1fr)_72px] sm:gap-6 sm:px-8">
            <span class="font-sans text-sm sm:text-base">[ {{ String(index + 1).padStart(2, '0') }} ]</span>
            <strong class="font-sans text-lg font-bold uppercase leading-5 tracking-[-0.03em] sm:text-3xl sm:leading-8">
              {{ item.question }}
            </strong>
            <span class="relative size-10 justify-self-end sm:size-14" aria-hidden="true">
              <span class="absolute left-1/2 top-1/2 h-px w-full -translate-x-1/2 bg-current" />
              <span class="absolute left-1/2 top-1/2 h-full w-px -translate-y-1/2 bg-current transition-transform group-open:rotate-90 group-open:scale-y-0" />
            </span>
          </summary>
          <div class="border-t border-current/35 px-4 py-7 sm:pl-[164px] sm:pr-8">
            <p class="max-w-[900px] whitespace-pre-line font-sans text-base leading-5">{{ item.answer }}</p>
          </div>
        </details>
      </div>
    </div>
  </section>
</template>
