<script setup lang="ts">
import FullPage from '@shared/ui/page/FullPage.vue'

defineProps<{
  title: string
}>()
</script>

<template>
  <FullPage id="top" next-label="Перейти к следующей секции">
    <div class="mx-auto flex w-full max-w-[1920px] flex-1 items-center px-4 sm:px-6 lg:px-10">
      <div class="flex w-full justify-start">
        <h1 class="text-left font-display pt-10 lg:pt-80 text-[clamp(80px,20vw,320px)] font-black uppercase leading-none tracking-[-0.03em] text-accent whitespace-pre-line">
          {{ title }}
        </h1>
      </div>
    </div>
  </FullPage>
</template>
