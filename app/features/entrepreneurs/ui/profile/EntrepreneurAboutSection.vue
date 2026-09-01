<script setup lang="ts">
import type { EntrepreneurAboutMenuItem } from '@features/entrepreneurs/model/entrepreneur.types'
import { localizeRussianServiceHeading, protectPrepositions } from '@shared/lib/typography'
import ArrowMark from '@shared/ui/icons/ArrowMark.vue'

const props = defineProps<{
  intro: string
  name: string
  items: EntrepreneurAboutMenuItem[]
  gallery: string[]
}>()

const defaultImageIndex = computed(() => props.items.length > 1 ? 1 : 0)
const hoveredIndex = shallowRef<number | null>(null)
const protectedIntro = computed(() => protectPrepositions(props.intro))

const activeImage = computed(() => {
  const imageIndex = hoveredIndex.value ?? defaultImageIndex.value
  const itemImage = props.items[imageIndex]?.image
  if (itemImage) return itemImage
  if (!props.gallery.length) return '/images/placeholder.svg'
  return props.gallery[imageIndex % props.gallery.length] || props.gallery[0] || '/images/placeholder.svg'
})

const setActive = (index: number) => {
  hoveredIndex.value = index
}

const clearActive = () => {
  hoveredIndex.value = null
}

const itemClass = (index: number) => {
  if (index === 1) {
    return 'border-accent bg-accent text-text-on-accent hover:border-text/10 hover:bg-surface hover:text-text focus-visible:border-text/10 focus-visible:bg-surface focus-visible:text-text'
  }

  return 'border-text/10 bg-surface text-text hover:border-accent hover:bg-accent hover:text-text-on-accent focus-visible:border-accent focus-visible:bg-accent focus-visible:text-text-on-accent'
}
</script>

<template>
  <section id="about" class="min-h-svh bg-bg py-10 pb-[90px] max-lg:min-h-0 max-lg:px-5 max-lg:pb-20">
    <div class="mx-auto mb-[90px] w-[min(calc(100%_-_80px),1920px)] max-lg:mb-10 max-lg:w-full">
      <p v-if="intro" class="m-0 w-[min(720px,42%)] whitespace-pre-line font-sans text-base leading-4 text-text max-lg:w-full">
        {{ protectedIntro }}
      </p>
    </div>

    <div class="mx-auto grid w-[min(calc(100%_-_80px),1920px)] grid-cols-[minmax(0,2fr)_minmax(0,3fr)] items-start gap-[30px] max-lg:w-full max-lg:grid-cols-1">
      <div class="order-2 self-start overflow-hidden bg-[#d9d9d9] lg:sticky lg:top-20 max-lg:order-1">
        <NuxtImg
          :src="activeImage"
          :alt="name"
          sizes="320:100vw 480:100vw sm:100vw md:100vw lg:60vw xl:60vw 2xl:60vw 2000:1134px"
          format="webp"
          loading="lazy"
          decoding="async"
          class="block h-auto w-full object-contain"
        />
      </div>

      <nav class="order-1 flex flex-col gap-2.5 max-lg:order-2" aria-label="Навигация по странице героя">
        <NuxtLink
          v-for="(item, index) in items"
          :key="item.href"
          :to="item.href"
          class="relative flex min-h-[10.75rem] min-w-0 flex-col justify-between border p-4 no-underline transition-colors duration-200 max-md:min-h-28"
          :class="itemClass(index)"
          @blur="clearActive"
          @mouseenter="setActive(index)"
          @mouseleave="clearActive"
          @focus="setActive(index)"
        >
          <strong class="block min-w-0 max-w-full w-[68%] self-end whitespace-pre-line text-right font-sans text-[clamp(1.5rem,2.35vw,2rem)] font-bold uppercase leading-none tracking-[-0.04em] [overflow-wrap:anywhere] hyphens-auto">
            {{ protectPrepositions(localizeRussianServiceHeading(item.label)) }}
          </strong>
          <small class="block min-w-0 w-3/5 whitespace-pre-line font-sans text-base uppercase leading-4 text-current [overflow-wrap:anywhere] hyphens-auto max-md:text-[13px] max-md:leading-[14px]">
            {{ protectPrepositions(item.note) }}
          </small>
          <ArrowMark class="absolute bottom-3.5 right-4 h-[19px] w-[34px]" />
        </NuxtLink>
      </nav>
    </div>
  </section>
</template>
