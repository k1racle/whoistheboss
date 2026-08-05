<script setup lang="ts">
import FullPage from '@shared/ui/page/FullPage.vue'

const props = defineProps<{
  title: string
}>()

const titleLines = computed(() => {
  const lines = props.title.split(/\r?\n/).map(line => line.trim()).filter(Boolean)

  return {
    first: lines[0] || 'ГЛАВНЫЕ',
    second: lines.slice(1).join(' ') || 'КОМПАНИИ',
  }
})
</script>

<template>
  <FullPage id="top" next-label="Перейти к следующей секции">
    <div class="mx-auto flex w-full items-center max-w-[1920px] flex-1 px-5 pt-50 sm:px-6 lg:px-10 lg:pb-[70px]">
      <h1 class="flex w-full flex-col gap-1 font-display text-[58px] font-black uppercase leading-[0.9] text-accent tracking-normal sm:text-[110px] lg:text-[220px] 2xl:text-[320px]">
        <span class="self-start">{{ titleLines.first }}</span>
        <span class="self-end text-right">{{ titleLines.second }}</span>
      </h1>
    </div>
  </FullPage>
</template>
