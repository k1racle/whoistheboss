<script setup lang="ts">
import type { ArticleRowItem } from '@shared/types/article-row'
import { ROUTES } from '@shared/navigation'
import ArrowMark from '@shared/ui/icons/ArrowMark.vue'

/**
 * Article row layout contract:
 * - Mobile layout is intentionally separate; do not change mobile classes here
 *   without a dedicated mobile task.
 * - Desktop grid is fixed as: author | title | animation-block | arrow.
 * - The arrow column is exactly 64px wide.
 * - The desktop divider spans all 4 columns and uses border-bottom, not height.
 * - Desktop text below the divider lives only in column 2:
 *   empty | text | empty | empty.
 * - Hover image stays absolute, but its random position is constrained to the
 *   animation-block column only.
 */
defineProps<{
  article: ArticleRowItem
}>()

const animationRef = useTemplateRef<HTMLElement>('animationBlock')
const hoverStyle = shallowRef<Record<string, string>>({
  '--hover-image-left': '0px',
  '--hover-image-top': '0px',
  '--hover-image-rotation': '6deg',
})

const randomizeHoverImage = () => {
  const animationBlock = animationRef.value
  if (!animationBlock || !window.matchMedia('(min-width: 1024px)').matches) return

  const { width, height } = animationBlock.getBoundingClientRect()
  const mediaWidth = 180
  const maxLeft = Math.max(0, width - mediaWidth)
  const maxTop = Math.max(0, Math.min(32, height))
  const left = Math.random() * maxLeft
  const top = Math.random() * maxTop
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
  <li class="relative w-full max-w-[100vw] min-w-0 overflow-hidden lg:overflow-visible">
    <NuxtLink
      :to="ROUTES.ARTICLE(article.slug)"
      class="group relative flex min-h-[260px] w-full max-w-full min-w-0 flex-col overflow-hidden border border-transparent bg-surface px-5 py-6 text-text no-underline transition-colors duration-200 hover:border-accent hover:bg-accent hover:text-text-on-accent focus-visible:border-accent focus-visible:bg-accent focus-visible:text-text-on-accent sm:px-6 lg:grid lg:h-[196px] lg:min-h-0 lg:grid-cols-[minmax(160px,1fr)_minmax(240px,1.8fr)_minmax(220px,0.8fr)_64px] lg:grid-rows-[auto_auto_1fr] lg:gap-x-6 lg:gap-y-5 lg:overflow-visible lg:px-8 xl:grid-cols-[minmax(220px,1.1fr)_minmax(360px,1.8fr)_minmax(260px,0.8fr)_64px] xl:gap-x-10"
      :aria-label="`${article.title}, ${article.entrepreneurName || 'Кто здесь главный?'}`"
      @focus="randomizeHoverImage"
      @mouseenter="randomizeHoverImage"
    >
      <strong class="relative z-[2] min-w-0 break-words font-sans text-xl font-bold uppercase leading-6 lg:col-start-1 lg:row-start-1 lg:self-center lg:text-[32px] lg:leading-8 lg:tracking-[-1.25px]">
        {{ article.entrepreneurName || 'Кто здесь главный?' }}
      </strong>

      <span class="relative z-[2] my-5 h-px w-full shrink-0 bg-current opacity-30 lg:hidden" aria-hidden="true" />

      <span class="relative z-[2] flex min-w-0 flex-1 flex-col lg:contents">
        <strong class="min-w-0 break-words font-sans text-2xl font-bold uppercase leading-7 lg:col-start-2 lg:row-start-1 lg:self-center lg:text-[32px] lg:leading-8 lg:tracking-[-1.25px]">
          {{ article.title }}
        </strong>

        <span class="mt-auto flex min-w-0 items-end justify-between gap-5 pt-6 lg:contents">
          <span
            v-if="article.subtitle"
            class="min-w-0 font-sans text-base font-normal leading-5 lg:col-start-2 lg:row-start-3"
          >
            {{ article.subtitle }}
          </span>

          <span class="ml-auto flex shrink-0 items-center justify-end text-current lg:col-start-4 lg:row-start-1 lg:ml-0 lg:h-16 lg:w-16 lg:self-center" aria-hidden="true">
            <ArrowMark class="h-[42px] w-14 lg:h-12 lg:w-16" />
          </span>
        </span>
      </span>

      <span class="hidden lg:col-span-4 lg:col-start-1 lg:row-start-2 lg:block lg:border-b-[2.5px] lg:border-border-strong" aria-hidden="true" />

      <span
        ref="animationBlock"
        class="relative z-[3] hidden min-h-0 min-w-0 overflow-visible lg:col-start-3 lg:row-start-1 lg:block lg:self-stretch"
        aria-hidden="true"
      >
        <span
          class="pointer-events-none absolute left-[var(--hover-image-left)] top-[var(--hover-image-top)] aspect-[4/5] w-[180px] rotate-[var(--hover-image-rotation)] scale-[0.92] overflow-hidden bg-border-strong opacity-0 transition-[opacity,transform] duration-200 group-hover:scale-100 group-hover:opacity-100 group-focus-visible:scale-100 group-focus-visible:opacity-100"
          :style="hoverStyle"
        >
          <NuxtImg
            :src="article.coverImage || '/images/placeholder.svg'"
            alt=""
            width="180"
            height="225"
            fit="cover"
            sizes="180px"
            densities="1x 2x"
            quality="82"
            format="webp"
            loading="lazy"
            decoding="async"
            class="h-full w-full object-cover"
          />
        </span>
      </span>
    </NuxtLink>
  </li>
</template>
