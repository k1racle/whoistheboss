<script setup lang="ts">
import type { BlogMainFeatureCard } from '@features/blog/model/blog.types'
import { computed } from 'vue'
import { NuxtLink } from '#components'

const props = defineProps<{
  card: BlogMainFeatureCard
  reverse?: boolean
}>()

const hasLink = computed(() => Boolean(props.card.url))
const isExternal = computed(() => /^https?:\/\//.test(props.card.url))
</script>

<template>
  <article class="grid overflow-hidden border border-border-strong bg-surface lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1fr)]">
    <div
      :class="[
        'flex flex-col justify-between gap-8 p-6 sm:p-8 lg:p-10',
        reverse ? 'lg:order-2' : '',
      ]"
    >
      <h3 class="font-display text-[clamp(2.4rem,6vw,4.8rem)] font-black uppercase leading-[0.9] tracking-[-0.04em] text-text">
        {{ card.title }}
      </h3>

      <div class="flex flex-col items-start gap-5 lg:flex-row lg:items-end lg:justify-between">
        <p
          v-if="card.text"
          class="max-w-[30rem] font-sans text-base leading-7 text-text/80 sm:text-lg"
        >
          {{ card.text }}
        </p>

        <component
          :is="hasLink ? (isExternal ? 'a' : NuxtLink) : 'span'"
          v-bind="hasLink ? (isExternal ? { href: card.url, target: '_blank', rel: 'noopener' } : { to: card.url }) : {}"
          class="inline-flex items-center gap-3 border border-border-strong px-4 py-3 font-sans text-sm uppercase leading-4 text-accent transition-colors hover:border-accent sm:text-base"
        >
          <span>{{ hasLink ? 'Открыть' : 'Скоро' }}</span>
          <span aria-hidden="true">[ ↗ ]</span>
        </component>
      </div>
    </div>

    <component
      :is="hasLink ? (isExternal ? 'a' : NuxtLink) : 'div'"
      v-bind="hasLink ? (isExternal ? { href: card.url, target: '_blank', rel: 'noopener' } : { to: card.url }) : {}"
      :class="[
        'relative block min-h-[280px] overflow-hidden bg-bg sm:min-h-[360px]',
        reverse ? 'lg:order-1' : '',
      ]"
    >
      <img
        v-if="card.image"
        :src="card.image"
        :alt="card.title"
        class="h-full w-full object-cover transition-transform duration-500 hover:scale-[1.03]"
      >
      <div
        v-else
        class="flex h-full items-center justify-center px-8 py-12 text-center"
      >
        <p class="font-display text-[clamp(2rem,6vw,4rem)] font-black uppercase leading-[0.92] tracking-[-0.04em] text-text/28">
          Главная новость
        </p>
      </div>
    </component>
  </article>
</template>
