<script setup lang="ts">
withDefaults(defineProps<{
  text: string
  durationSeconds?: number
  repeat?: number
}>(), {
  durationSeconds: 48,
  repeat: 4,
})
</script>

<template>
  <section class="overflow-hidden border-y border-accent bg-accent py-3.5" aria-label="Бегущая строка">
    <div
      class="text-marquee-track flex w-max will-change-transform"
      :style="{ '--marquee-duration': `${durationSeconds}s` }"
    >
      <div v-for="group in 2" :key="group" class="flex items-center">
        <span
          v-for="index in repeat"
          :key="`${group}-${index}`"
          class="whitespace-nowrap px-8 font-display text-[80px] font-black uppercase leading-[80px] tracking-[-0.03em] text-text-on-accent max-lg:px-5 max-lg:text-2xl max-lg:leading-7"
        >
          {{ text }}
        </span>
      </div>
    </div>
  </section>
</template>

<style scoped>
.text-marquee-track {
  animation: textMarquee var(--marquee-duration) linear infinite;
}

@keyframes textMarquee {
  to {
    transform: translateX(-50%);
  }
}
</style>
