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
  if (!card || !window.matchMedia('(min-width: 1024px)').matches) return

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
  <li ref="card" class="relative w-full max-w-[100vw] min-w-0 overflow-hidden lg:overflow-visible">
    <NuxtLink
      :to="ROUTES.ARTICLE(article.slug)"
      class="group relative flex min-h-[260px] w-full max-w-full min-w-0 flex-col overflow-hidden border border-transparent bg-surface px-5 py-6 text-text no-underline transition-colors duration-200 hover:border-accent hover:bg-accent hover:text-text-on-accent focus-visible:border-accent focus-visible:bg-accent focus-visible:text-text-on-accent sm:px-6 lg:grid lg:h-[196px] lg:min-h-0 lg:grid-cols-[minmax(220px,1.1fr)_minmax(360px,1.8fr)_180px] lg:gap-10 lg:overflow-visible lg:px-8"
      :aria-label="`${article.title}, ${article.entrepreneurName || 'Кто здесь главный?'}`"
      @focus="randomizeHoverImage"
      @mouseenter="randomizeHoverImage"
    >
      <strong class="relative z-[2] min-w-0 break-words font-sans text-xl font-bold uppercase leading-6 lg:self-center lg:text-[32px] lg:leading-8 lg:tracking-[-1.25px]">
        {{ article.entrepreneurName || 'Кто здесь главный?' }}
      </strong>

      <span class="relative z-[2] my-5 h-px w-full shrink-0 bg-current opacity-30 lg:hidden" aria-hidden="true" />

      <span class="relative z-[2] flex min-w-0 flex-1 flex-col lg:self-center">
        <strong class="min-w-0 break-words font-sans text-2xl font-bold uppercase leading-7 lg:text-[32px] lg:leading-8 lg:tracking-[-1.25px]">
          {{ article.title }}
        </strong>

        <span class="mt-auto flex min-w-0 items-end justify-between gap-5 pt-6 lg:mt-8 lg:block lg:pt-0">
          <span
            v-if="article.subtitle"
            class="min-w-0 font-sans text-base font-normal leading-5"
          >
            {{ article.subtitle }}
          </span>

          <span class="ml-auto flex shrink-0 items-center justify-end text-current lg:absolute lg:right-[-220px] lg:top-1/2 lg:-translate-y-1/2" aria-hidden="true">
            <ArrowMark class="h-[42px] w-14 lg:h-12 lg:w-16" />
          </span>
        </span>
      </span>

      <span
        class="pointer-events-none absolute left-[var(--hover-image-left)] top-[var(--hover-image-top)] z-[3] hidden aspect-[4/5] w-[180px] rotate-[var(--hover-image-rotation)] scale-[0.92] overflow-hidden bg-border-strong opacity-0 transition-[opacity,transform] duration-200 group-hover:scale-100 group-hover:opacity-100 group-focus-visible:scale-100 group-focus-visible:opacity-100 lg:block"
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
    </NuxtLink>
  </li>
</template>
