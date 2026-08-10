<script setup lang="ts">
defineProps<{
  src: string
  alt: string
}>()

const useImageFallback = (payload: string | Event) => {
  if (typeof payload === 'string') return

  const image = payload.currentTarget
  if (!(image instanceof HTMLImageElement) || image.src.endsWith('/images/placeholder.svg')) return

  image.src = '/images/placeholder.svg'
}
</script>

<template>
  <article class="min-w-[85%] shrink-0 snap-center overflow-hidden border border-border-strong bg-surface shadow-[0_18px_40px_rgba(7,7,7,0.08)]">
    <div class="grid h-full w-full">
      <div class="col-start-1 row-start-1 aspect-square animate-pulse bg-linear-to-br from-border-strong to-bg" aria-hidden="true" />
      <NuxtImg
        :src="src"
        :alt="alt"
        class="col-start-1 row-start-1 h-full w-full object-cover"
        loading="lazy"
        @error="useImageFallback"
      />
    </div>
  </article>
</template>
