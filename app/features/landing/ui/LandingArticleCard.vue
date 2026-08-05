<script setup lang="ts">
import type { LandingArticle } from '@features/landing/model/landing.data'
import { ROUTES } from '@shared/navigation'

defineProps<{
  article: LandingArticle
}>()

const cardRef = ref<HTMLElement | null>(null)
const hoverStyle = ref({
  left: '70%',
  top: '0px',
  transform: 'rotate(6deg)',
})

const randomizeHoverCard = () => {
  const el = cardRef.value
  if (!el) return
  if (window.matchMedia('(max-width: 900px)').matches) return

  const { width, height } = el.getBoundingClientRect()
  const cardWidth = 144
  const cardHeight = 96
  const zoneStart = width * 0.5
  const zoneEnd = width * 0.85
  const maxLeft = Math.max(zoneStart, Math.min(zoneEnd, width - cardWidth - 8))
  const left = zoneStart + Math.random() * (maxLeft - zoneStart)
  const maxTop = Math.max(0, height - cardHeight - 8)
  const top = 4 + Math.random() * Math.max(maxTop - 4, 0)
  let rotation = -10 + Math.random() * 20
  if (Math.abs(rotation) < 2) rotation = rotation < 0 ? -2 : 2

  hoverStyle.value = {
    left: `${left.toFixed(1)}px`,
    top: `${top.toFixed(1)}px`,
    transform: `rotate(${rotation.toFixed(2)}deg)`,
  }
}
</script>

<template>
  <li
    ref="cardRef"
    class="group relative overflow-hidden"
  >
    <NuxtLink
      :to="ROUTES.ARTICLE(article.slug)"
      class="grid grid-cols-1 gap-2 px-4 py-6 transition-colors duration-300 group-hover:bg-accent group-hover:text-text-on-accent sm:px-6 md:grid-cols-[1fr_3fr] md:gap-x-6 lg:px-10"
      :aria-label="`${article.title}, ${article.entrepreneurName ?? ''}`"
      @mouseenter="randomizeHoverCard"
      @focus="randomizeHoverCard"
    >
      <div>
        <span class="font-sans text-xs font-bold uppercase tracking-[0.14em] text-text/70 transition-colors duration-300 group-hover:text-text-on-accent md:text-sm">
          {{ article.entrepreneurName || 'Кто здесь главный?' }}
        </span>
      </div>

      <div class="flex items-start justify-between gap-4">
        <h3 class="font-sans text-base font-bold uppercase leading-tight tracking-tight text-text transition-colors duration-300 group-hover:text-text-on-accent md:text-xl">
          {{ article.title }}
        </h3>
        <span
          class="shrink-0 font-sans text-base leading-none text-text-muted transition-colors duration-300 group-hover:text-text-on-accent md:text-lg"
          aria-hidden="true"
        >
          [ ↗ ]
        </span>
      </div>

      <div v-if="article.subtitle" class="border-t border-border-strong transition-colors duration-300 group-hover:border-text-on-accent/30 md:col-span-2" />

      <div v-if="article.subtitle" class="pt-2 md:col-start-2">
        <p class="max-w-xl font-sans text-xs uppercase leading-5 text-text-muted transition-colors duration-300 group-hover:text-text-on-accent">
          {{ article.subtitle }}
        </p>
      </div>
    </NuxtLink>

    <div
      aria-hidden="true"
      class="pointer-events-none absolute z-10"
      :style="hoverStyle"
    >
      <div class="h-24 w-36 overflow-hidden border border-border-strong bg-surface opacity-0 shadow-[0_16px_32px_rgba(7,7,7,0.18)] transition-[opacity,transform] duration-200 group-hover:scale-100 group-hover:opacity-100 scale-90">
        <NuxtImg
          v-if="article.coverImage"
          :src="article.coverImage"
          :alt="article.title"
          class="h-full w-full object-cover"
          densities="x1 x2"
        />
        <div
          v-else
          class="flex h-full w-full flex-col justify-between bg-text p-2 text-text-on-accent"
        >
          <span class="line-clamp-3 font-sans text-[10px] font-bold uppercase leading-tight">
            {{ article.title }}
          </span>
          <span class="self-end font-sans text-xs leading-none">
            [ ↗ ]
          </span>
        </div>
      </div>
    </div>
  </li>
</template>
