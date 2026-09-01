<script setup lang="ts">
import type { EntrepreneurDetailData } from '@features/entrepreneurs/model/entrepreneur.types'
import AutoFitText from '@shared/ui/text/AutoFitText.vue'

const props = defineProps<{
  entrepreneur: EntrepreneurDetailData
}>()

const heroTitleLines = computed(() => props.entrepreneur.heroTitleLines.slice(0, 3))

const heroTeasers = computed(() => {
  const candidates = [
    props.entrepreneur.heroRightTeaser || props.entrepreneur.quote || props.entrepreneur.title,
    props.entrepreneur.heroLeftTeaser || props.entrepreneur.title,
    props.entrepreneur.heroBottomRightTeaser || props.entrepreneur.title,
  ]
  const seen = new Set<string>()
  return candidates.map((text) => {
    const normalized = text.trim()
    if (!normalized || seen.has(normalized)) return ''
    seen.add(normalized)
    return text
  })
})

const mobileTeaser = computed(() => heroTeasers.value.find(Boolean) || '')
</script>

<template>
  <section id="top" class="relative min-h-[calc(100svh-142px)] overflow-hidden bg-bg">
    <h1 class="sr-only">
      {{ heroTitleLines.join(' ') }}
    </h1>

    <div class="mx-auto hidden min-h-[calc(100svh-142px)] w-[min(calc(100%_-_80px),1920px)] items-end lg:flex">
      <div class="flex w-full flex-col gap-[clamp(1rem,1.5vw,2rem)]">
        <div v-if="heroTitleLines[0]" class="flex w-full items-end justify-between gap-10">
          <div class="min-w-0 flex-1" aria-hidden="true">
            <AutoFitText
              as="span"
              :text="heroTitleLines[0]"
              class="block whitespace-nowrap text-left font-display text-[clamp(120px,16.6667vw,320px)] font-black uppercase leading-[0.78] tracking-[-0.03em] text-accent"
            />
          </div>
          <p
            v-if="heroTeasers[0]"
            class="m-0 w-[min(500px,32vw)] max-w-[500px] shrink-0 self-center whitespace-pre-line font-sans text-base font-bold uppercase leading-4 text-text"
          >
            {{ heroTeasers[0] }}
          </p>
        </div>

        <div v-if="heroTitleLines[1]" class="flex w-full items-end justify-between gap-10">
          <p
            v-if="heroTeasers[1]"
            class="m-0 w-[min(500px,32vw)] max-w-[500px] shrink-0 self-center whitespace-pre-line text-right font-sans text-base font-bold uppercase leading-4 text-text"
          >
            {{ heroTeasers[1] }}
          </p>
          <div class="min-w-0 flex-1" aria-hidden="true">
            <AutoFitText
              as="span"
              :text="heroTitleLines[1]"
              class="block whitespace-nowrap text-right font-display text-[clamp(120px,16.6667vw,320px)] font-black uppercase leading-[0.78] tracking-[-0.03em] text-accent"
            />
          </div>
        </div>

        <div v-if="heroTitleLines[2]" class="flex w-full items-end justify-between gap-10">
          <div class="min-w-0 flex-1" aria-hidden="true">
            <AutoFitText
              as="span"
              :text="heroTitleLines[2]"
              class="block whitespace-nowrap text-left font-display text-[clamp(120px,16.6667vw,320px)] font-black uppercase leading-[0.78] tracking-[-0.03em] text-accent"
            />
          </div>
          <p
            v-if="heroTeasers[2]"
            class="m-0 w-[min(500px,32vw)] max-w-[500px] shrink-0 self-center whitespace-pre-line font-sans text-base font-bold uppercase leading-4 text-text"
          >
            {{ heroTeasers[2] }}
          </p>
        </div>
      </div>
    </div>

    <div class="mx-auto flex min-h-[calc(100svh-142px)] w-[calc(100%_-_40px)] items-end pb-6 pt-[84px] lg:hidden">
      <div class="flex w-full flex-col items-start gap-5">
        <p
          v-if="mobileTeaser"
          class="m-0 w-full whitespace-pre-line font-sans text-[13px] font-bold uppercase leading-[14px] text-text"
        >
          {{ mobileTeaser }}
        </p>

        <div class="flex w-full flex-col" aria-hidden="true">
          <AutoFitText
            v-for="(line, index) in heroTitleLines"
            :key="`${index}-${line}`"
            as="span"
            :text="line"
            class="m-0 block whitespace-nowrap font-display text-[clamp(62px,18vw,106px)] font-black uppercase leading-[0.88] tracking-[-0.03em] text-accent"
          />
        </div>
      </div>
    </div>
  </section>
</template>
