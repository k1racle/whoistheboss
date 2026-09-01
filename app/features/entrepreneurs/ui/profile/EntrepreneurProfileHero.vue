<script setup lang="ts">
import type { EntrepreneurDetailData } from '@features/entrepreneurs/model/entrepreneur.types'
import AutoFitText from '@shared/ui/text/AutoFitText.vue'

const props = defineProps<{
  entrepreneur: EntrepreneurDetailData
}>()

const heroTitleLines = computed(() => props.entrepreneur.heroTitleLines.slice(0, 3))

const heroTeasers = computed(() => {
  const candidates = [
    {
      text: props.entrepreneur.heroRightTeaser || props.entrepreneur.quote || props.entrepreneur.title,
      className: 'lg:right-0 lg:top-[12%]',
    },
    {
      text: props.entrepreneur.heroLeftTeaser || props.entrepreneur.title,
      className: 'lg:left-0 lg:top-1/2 lg:-translate-y-1/2 lg:text-right',
    },
    {
      text: props.entrepreneur.heroBottomRightTeaser || props.entrepreneur.title,
      className: 'lg:bottom-[8%] lg:right-0',
    },
  ]
  const seen = new Set<string>()
  return candidates.filter(({ text }) => {
    const normalized = text.trim()
    if (!normalized || seen.has(normalized)) return false
    seen.add(normalized)
    return true
  })
})

const titleLineClass = (index: number) => {
  if (index === 1) return 'lg:justify-self-end lg:text-right'
  return 'lg:justify-self-start lg:text-left'
}
</script>

<template>
  <section id="top" class="relative min-h-[calc(100svh-142px)] overflow-hidden bg-bg">
    <div class="relative mx-auto flex min-h-[calc(100svh-142px)] w-[calc(100%_-_40px)] items-end pb-6 pt-[84px] lg:w-[min(calc(100%_-_80px),1920px)] lg:pb-0 lg:pt-0">
      <div class="flex w-full flex-col items-start gap-5">
        <p
          v-for="(teaser, index) in heroTeasers"
          :key="teaser.text"
          class="m-0 w-full whitespace-pre-line font-sans text-[13px] font-bold uppercase leading-[14px] text-text lg:absolute lg:z-10 lg:w-[min(500px,32vw)] lg:max-w-[500px] lg:text-base lg:leading-4"
          :class="[teaser.className, { 'hidden lg:block': index > 0 }]"
        >
          {{ teaser.text }}
        </p>

        <h1 class="m-0 grid w-full grid-cols-1 gap-0 lg:grid-rows-3 lg:gap-[clamp(1rem,1.5vw,2rem)]">
          <AutoFitText
            v-for="(line, index) in heroTitleLines"
            :key="`${index}-${line}`"
            as="span"
            :text="line"
            class="m-0 whitespace-nowrap font-display text-[clamp(62px,18vw,106px)] font-black uppercase leading-[0.88] tracking-[-0.03em] text-accent lg:text-[clamp(120px,16.6667vw,320px)] lg:leading-[0.78]"
            :class="titleLineClass(index)"
          />
        </h1>
      </div>
    </div>
  </section>
</template>
