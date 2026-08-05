<script setup lang="ts">
defineProps<{
  title: string
}>()
</script>

<template>
  <section class="flex min-h-[calc(100svh-72px)] items-center bg-bg px-4 py-12 sm:px-6 lg:px-10">
    <div class="mx-auto w-full max-w-[1920px]">
      <h1 class="font-display text-[clamp(4rem,13vw,12rem)] font-black uppercase leading-[0.84] tracking-[-0.05em] text-accent whitespace-pre-line">
        {{ title }}
      </h1>
    </div>
  </section>
</template>
