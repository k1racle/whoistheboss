<script setup lang="ts">
import type { EntrepreneurAboutMenuItem } from '@features/entrepreneurs/model/entrepreneur.types'

const props = defineProps<{
  intro: string
  name: string
  items: EntrepreneurAboutMenuItem[]
  gallery: string[]
}>()

const defaultImageIndex = computed(() => props.items.length > 1 ? 1 : 0)
const hoveredIndex = shallowRef<number | null>(null)

const activeImage = computed(() => {
  if (!props.gallery.length) return '/images/placeholder.svg'
  const imageIndex = hoveredIndex.value ?? defaultImageIndex.value
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
        {{ intro }}
      </p>
    </div>

    <div class="mx-auto grid w-[min(calc(100%_-_80px),1920px)] grid-cols-[minmax(0,2fr)_minmax(0,3fr)] items-stretch gap-[30px] max-lg:w-full max-lg:grid-cols-1">
      <div class="order-2 overflow-hidden bg-[#d9d9d9] max-lg:order-1">
        <img :src="activeImage" :alt="name" class="h-full min-h-[720px] w-full object-cover max-lg:min-h-[28rem]">
      </div>

      <nav class="order-1 flex flex-col gap-2.5 max-lg:order-2" aria-label="Навигация по странице героя">
        <NuxtLink
          v-for="(item, index) in items"
          :key="item.href"
          :to="item.href"
          class="relative flex min-h-[10.75rem] flex-col justify-between border p-4 no-underline transition-colors duration-200 max-md:min-h-28"
          :class="itemClass(index)"
          @blur="clearActive"
          @mouseenter="setActive(index)"
          @mouseleave="clearActive"
          @focus="setActive(index)"
        >
          <strong class="block w-[64%] self-end text-right font-sans text-[32px] font-bold uppercase leading-8 tracking-[-1.25px] max-md:text-2xl max-md:leading-6">
            {{ item.label }}
          </strong>
          <small class="block w-3/5 font-sans text-base uppercase leading-4 text-current max-md:text-[13px] max-md:leading-[14px]">
            {{ item.note }}
          </small>
          <span class="absolute bottom-3.5 right-4 text-[22px] leading-none" aria-hidden="true">[↗]</span>
        </NuxtLink>
      </nav>
    </div>
  </section>
</template>
