<script setup lang="ts">
import type { BlogMainFeatureCard as BlogMainFeatureCardData } from '@features/blog/model/blog.types'
import ArrowMark from '@shared/ui/icons/ArrowMark.vue'

defineProps<{
  card: BlogMainFeatureCardData
  reverse: boolean
}>()

const useImageFallback = (event: string | Event) => {
  if (!(event instanceof Event)) return

  const image = event.currentTarget
  if (!(image instanceof HTMLImageElement) || image.src.endsWith('/images/placeholder.svg')) return

  image.removeAttribute('srcset')
  image.removeAttribute('sizes')
  image.src = '/images/placeholder.svg'
}
</script>

<template>
  <article
    class="grid grid-cols-1 text-text lg:grid-cols-2"
    :class="{ 'lg:[&>*:first-child]:order-2 lg:[&>*:last-child]:order-1': reverse }"
  >
    <div
      class="relative flex min-h-[360px] min-w-0 flex-col justify-between pb-6 lg:min-h-0 lg:pb-[18px]"
      :class="reverse ? 'lg:pl-8' : 'lg:pr-8'"
    >
      <h2
        class="max-w-[90%] font-display text-5xl font-black uppercase leading-[0.92] tracking-[-0.03em] text-text lg:text-[clamp(48px,4.2vw,80px)]"
        :class="{ 'lg:self-end lg:text-right': reverse }"
      >
        {{ card.title }}
      </h2>

      <div
        class="flex items-end gap-8"
        :class="reverse ? 'justify-start' : 'justify-end'"
      >
        <component
          :is="card.url ? 'NuxtLink' : 'span'"
          :to="card.url || undefined"
          class="absolute bottom-[18px] flex items-center justify-center text-current no-underline transition-colors hover:text-accent"
          :class="reverse ? 'right-0' : 'left-0'"
          :aria-label="card.url ? `Открыть материал «${card.title}»` : undefined"
          :aria-hidden="card.url ? undefined : true"
        >
          <ArrowMark class="h-[2.9rem] w-[4.5rem] lg:h-[108px] lg:w-[270px]" />
        </component>

        <p
          v-if="card.text"
          class="m-0 w-[min(52%,420px)] whitespace-pre-line font-sans text-base leading-4 text-text"
        >
          {{ card.text }}
        </p>
      </div>
    </div>

    <component
      :is="card.url ? 'NuxtLink' : 'div'"
      :to="card.url || undefined"
      class="block aspect-[4/3] overflow-hidden bg-border-strong text-current no-underline"
      :aria-label="card.url ? `Открыть материал «${card.title}»` : undefined"
      :aria-hidden="card.url ? undefined : true"
    >
      <NuxtImg
        v-if="card.image"
        :src="card.image"
        :alt="card.title"
        sizes="320:100vw 480:100vw sm:100vw lg:50vw 2000:920px"
        format="webp"
        class="h-full w-full object-cover"
        loading="lazy"
        decoding="async"
        @error="useImageFallback"
      />
      <span v-else class="block h-full w-full bg-border-strong" aria-hidden="true" />
    </component>
  </article>
</template>
