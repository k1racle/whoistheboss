<script setup lang="ts">
defineProps<{
  src: string
  alt: string
}>()
</script>

<template>
  <article class="min-w-[85%] shrink-0 snap-center overflow-hidden border border-border-strong bg-surface shadow-[0_18px_40px_rgba(7,7,7,0.08)]">
    <NuxtImg
      :src="src"
      :alt="alt"
      class="h-full w-full object-cover"
      densities="x1 x2"
    />
  </article>
</template>
