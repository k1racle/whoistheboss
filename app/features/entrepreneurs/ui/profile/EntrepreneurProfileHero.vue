<script setup lang="ts">
import type { EntrepreneurDetailData } from '@features/entrepreneurs/model/entrepreneur.types'

const props = defineProps<{
  entrepreneur: EntrepreneurDetailData
}>()

const heroSubtitle = computed(() =>
  props.entrepreneur.heroRightTeaser
  || props.entrepreneur.heroBottomRightTeaser
  || props.entrepreneur.heroLeftTeaser
  || props.entrepreneur.title
  || props.entrepreneur.quote
  || '',
)
const heroTitleLines = computed(() => props.entrepreneur.heroTitleLines.slice(0, 3))

const mobileTitleContainerRef = ref<HTMLElement | null>(null)
const mobileTitleRefs = ref<HTMLElement[]>([])
let mobileTitleResizeObserver: ResizeObserver | undefined
let mobileTitleFitFrame = 0

const fitMobileTitleLines = () => {
  window.cancelAnimationFrame(mobileTitleFitFrame)
  mobileTitleFitFrame = window.requestAnimationFrame(() => {
    const container = mobileTitleContainerRef.value
    if (!container || container.clientWidth === 0) return

    for (const title of mobileTitleRefs.value) {
      title.style.removeProperty('font-size')
    }

    const availableWidth = container.clientWidth - 2

    for (const title of mobileTitleRefs.value) {
      const naturalWidth = title.scrollWidth
      if (naturalWidth <= availableWidth) continue

      const naturalFontSize = Number.parseFloat(window.getComputedStyle(title).fontSize)
      const fittedFontSize = naturalFontSize * availableWidth / naturalWidth
      title.style.fontSize = `${fittedFontSize}px`
    }
  })
}

onMounted(() => {
  mobileTitleResizeObserver = new ResizeObserver(fitMobileTitleLines)
  if (mobileTitleContainerRef.value) {
    mobileTitleResizeObserver.observe(mobileTitleContainerRef.value)
  }

  fitMobileTitleLines()
  void document.fonts.ready.then(fitMobileTitleLines)
})

watch(heroTitleLines, () => {
  void nextTick(fitMobileTitleLines)
})

onBeforeUnmount(() => {
  window.cancelAnimationFrame(mobileTitleFitFrame)
  mobileTitleResizeObserver?.disconnect()
})
</script>

<template>
  <section id="top" class="relative min-h-[calc(100svh-142px)] overflow-hidden bg-bg">
    <div class="mx-auto hidden min-h-[calc(100svh-142px)] w-[min(calc(100%_-_80px),1920px)] items-end lg:flex">
      <div class="flex w-full flex-col gap-[clamp(1rem,1.5vw,2rem)]">
        <div class="flex w-full items-end justify-between gap-10">
          <span class="whitespace-nowrap font-display text-[clamp(120px,16.6667vw,320px)] font-black uppercase leading-[0.78] tracking-[-0.03em] text-accent">
            {{ heroTitleLines[0] }}
          </span>
          <p
            v-if="entrepreneur.heroRightTeaser || entrepreneur.quote"
            class="w-[min(500px,32vw)] max-w-[500px] self-center font-sans text-base font-bold uppercase leading-4 text-text"
          >
            {{ entrepreneur.heroRightTeaser || entrepreneur.quote }}
          </p>
        </div>

        <div class="flex w-full items-end justify-between gap-10">
          <p
            v-if="entrepreneur.heroLeftTeaser || entrepreneur.title"
            class="w-[min(500px,32vw)] max-w-[500px] self-center text-right font-sans text-base font-bold uppercase leading-4 text-text"
          >
            {{ entrepreneur.heroLeftTeaser || entrepreneur.title }}
          </p>
          <h1 class="m-0 whitespace-nowrap text-right font-display text-[clamp(120px,16.6667vw,320px)] font-black uppercase leading-[0.78] tracking-[-0.03em] text-accent">
            {{ heroTitleLines[1] }}
          </h1>
        </div>

        <div class="flex w-full items-end justify-between gap-10">
          <h1 class="m-0 whitespace-nowrap text-left font-display text-[clamp(120px,16.6667vw,320px)] font-black uppercase leading-[0.78] tracking-[-0.03em] text-accent">
            {{ heroTitleLines[2] }}
          </h1>
          <p
            v-if="entrepreneur.heroBottomRightTeaser || entrepreneur.title"
            class="w-[min(500px,32vw)] max-w-[500px] self-center font-sans text-base font-bold uppercase leading-4 text-text"
          >
            {{ entrepreneur.heroBottomRightTeaser || entrepreneur.title }}
          </p>
        </div>
      </div>
    </div>

    <div class="mx-auto flex min-h-[calc(100svh-142px)] w-[calc(100%_-_40px)] items-end pb-6 pt-[84px] lg:hidden">
      <div class="flex w-full flex-col items-start gap-5">
        <p
          v-if="heroSubtitle"
          class="m-0 w-full font-sans text-[13px] font-bold uppercase leading-[14px] text-text"
        >
          {{ heroSubtitle }}
        </p>

        <div ref="mobileTitleContainerRef" class="flex w-full flex-col">
          <h1
            v-for="(line, index) in heroTitleLines"
            ref="mobileTitleRefs"
            :key="`${index}-${line}`"
            class="m-0 whitespace-nowrap font-display text-[clamp(62px,18vw,106px)] font-black uppercase leading-[0.88] tracking-[-0.03em] text-accent"
          >
            {{ line }}
          </h1>
        </div>
      </div>
    </div>

  </section>
</template>
