<script setup lang="ts">
defineProps<{
  title: string
}>()
</script>

<template>
  <section class="flex min-h-[calc(100svh-72px)] items-center bg-text px-4 py-16 text-text-on-accent sm:px-6 lg:px-8 lg:py-24">
    <div class="mx-auto w-full max-w-7xl">
      <p class="text-sm font-medium uppercase tracking-[0.18em] text-text-on-accent/56">
        Как стать героем проекта
      </p>
      <h1 class="mt-6 font-display text-[clamp(4rem,13vw,11rem)] font-black uppercase leading-[0.82] tracking-[-0.05em] whitespace-pre-line">
        {{ title }}
      </h1>
    </div>
  </section>
</template>
