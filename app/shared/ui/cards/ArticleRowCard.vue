<script setup lang="ts">
import type { ArticleRowItem } from '@shared/types/article-row'
import { ROUTES } from '@shared/navigation'
import ArrowMark from '@shared/ui/icons/ArrowMark.vue'

defineProps<{
  article: ArticleRowItem
}>()

const cardRef = useTemplateRef<HTMLElement>('card')
const hoverStyle = shallowRef<Record<string, string>>({
  '--hover-image-left': '72%',
  '--hover-image-top': '-20px',
  '--hover-image-rotation': '6deg',
})

const randomizeHoverImage = () => {
  const card = cardRef.value
  if (!card || window.matchMedia('(max-width: 900px)').matches) return

  const cardWidth = card.getBoundingClientRect().width
  const mediaWidth = 180
  const zoneStart = cardWidth * 0.6
  const zoneEnd = cardWidth * 0.9
  const maxLeft = Math.max(zoneStart, zoneEnd - mediaWidth)
  const left = zoneStart + Math.random() * (maxLeft - zoneStart)
  const top = -30 + Math.random() * 40
  let rotation = -10 + Math.random() * 20
  if (Math.abs(rotation) < 2) rotation = rotation < 0 ? -2 : 2

  hoverStyle.value = {
    '--hover-image-left': `${left.toFixed(1)}px`,
    '--hover-image-top': `${top.toFixed(1)}px`,
    '--hover-image-rotation': `${rotation.toFixed(2)}deg`,
  }
}
</script>

<template>
  <li ref="card" class="relative overflow-visible">
    <NuxtLink
      :to="ROUTES.ARTICLE(article.slug)"
      class="group relative grid min-h-[280px] grid-cols-[minmax(0,1fr)_72px] gap-5 overflow-visible border border-transparent bg-surface px-5 py-6 text-text no-underline transition-colors duration-200 hover:border-accent hover:bg-accent hover:text-text-on-accent focus-visible:border-accent focus-visible:bg-accent focus-visible:text-text-on-accent sm:px-6 md:min-h-[210px] md:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)_96px] md:gap-6 lg:h-[196px] lg:min-h-0 lg:grid-cols-[minmax(220px,1.1fr)_minmax(360px,1.8fr)_180px] lg:gap-10 lg:px-8"
      :aria-label="`${article.title}, ${article.entrepreneurName || 'Кто здесь главный?'}`"
      @focus="randomizeHoverImage"
      @mouseenter="randomizeHoverImage"
    >
      <strong class="relative z-[2] self-center font-sans text-[27px] font-bold uppercase leading-[27px] tracking-[-1.25px] md:text-[32px] md:leading-8">
        {{ article.entrepreneurName || 'Кто здесь главный?' }}
      </strong>

      <span class="relative z-[2] flex min-w-0 flex-col self-center">
        <strong class="font-sans text-[27px] font-bold uppercase leading-[27px] tracking-[-1.25px] md:text-[32px] md:leading-8">
          {{ article.title }}
        </strong>
        <span
          v-if="article.subtitle"
          class="mt-5 font-sans text-base font-normal leading-4 md:mt-8"
        >
          {{ article.subtitle }}
        </span>
      </span>

      <span
        class="pointer-events-none absolute bottom-[-8px] right-7 z-[3] block aspect-[4/5] w-28 rotate-6 scale-[0.92] overflow-hidden bg-border-strong opacity-0 transition-[opacity,transform] duration-200 group-hover:scale-100 group-hover:opacity-100 group-focus-visible:scale-100 group-focus-visible:opacity-100 md:bottom-[-12px] md:right-28 md:w-[120px] lg:bottom-auto lg:right-auto lg:left-[var(--hover-image-left)] lg:top-[var(--hover-image-top)] lg:w-[180px] lg:rotate-[var(--hover-image-rotation)]"
        :style="hoverStyle"
        aria-hidden="true"
      >
        <img
          :src="article.coverImage || '/images/placeholder.svg'"
          alt=""
          loading="lazy"
          class="h-full w-full object-cover"
        >
      </span>

      <span class="absolute right-5 top-1/2 z-[2] flex -translate-y-1/2 items-center justify-end text-current md:right-6 lg:right-8" aria-hidden="true">
        <ArrowMark class="h-[42px] w-14 md:h-12 md:w-16" />
      </span>
    </NuxtLink>
  </li>
</template>
