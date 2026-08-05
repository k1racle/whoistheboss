<script setup lang="ts">
import type { BlogMainFeatureCard } from '@features/blog/model/blog.types'
import { NuxtLink } from '#components'

const props = defineProps<{
  card: BlogMainFeatureCard
  reverse?: boolean
}>()

const hasLink = computed(() => Boolean(props.card.url))
const isExternal = computed(() => /^https?:\/\//.test(props.card.url))
</script>

<template>
  <article class="grid overflow-hidden rounded-[32px] border border-black/10 bg-surface shadow-[0_24px_64px_rgba(7,7,7,0.06)] lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1fr)]">
    <div
      :class="[
        'flex flex-col justify-between gap-8 p-6 sm:p-8 lg:p-10',
        reverse ? 'lg:order-2' : '',
      ]"
    >
      <h3 class="font-display text-[clamp(2.6rem,6vw,5rem)] font-black uppercase leading-[0.9] tracking-[-0.04em] text-text">
        {{ card.title }}
      </h3>

      <div class="flex flex-col items-start gap-5 lg:flex-row lg:items-end lg:justify-between">
        <p
          v-if="card.text"
          class="max-w-[30rem] text-base leading-7 text-text/74 sm:text-lg"
        >
          {{ card.text }}
        </p>

        <component
          :is="hasLink ? (isExternal ? 'a' : NuxtLink) : 'span'"
          v-bind="hasLink ? (isExternal ? { href: card.url, target: '_blank', rel: 'noopener' } : { to: card.url }) : {}"
          class="inline-flex h-12 w-12 items-center justify-center rounded-full bg-accent text-text-on-accent transition-transform duration-300 hover:scale-110"
        >
          <svg
            class="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M7 17 17 7M9 7h8v8"
            />
          </svg>
        </component>
      </div>
    </div>

    <component
      :is="hasLink ? (isExternal ? 'a' : NuxtLink) : 'div'"
      v-bind="hasLink ? (isExternal ? { href: card.url, target: '_blank', rel: 'noopener' } : { to: card.url }) : {}"
      :class="[
        'relative block min-h-[280px] overflow-hidden bg-[#f1f1ec] sm:min-h-[360px]',
        reverse ? 'lg:order-1' : '',
      ]"
    >
      <img
        v-if="card.image"
        :src="card.image"
        :alt="card.title"
        class="h-full w-full object-cover transition-transform duration-500 hover:scale-[1.04]"
      >
      <div
        v-else
        class="flex h-full items-center justify-center px-8 py-12 text-center"
      >
        <p class="font-display text-[clamp(2.2rem,6vw,4rem)] font-black uppercase leading-[0.92] tracking-[-0.04em] text-text/24">
          Главная новость
        </p>
      </div>
    </component>
  </article>
</template>
