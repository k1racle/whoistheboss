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
          class="whitespace-nowrap px-5 font-sans text-2xl font-bold uppercase leading-7 tracking-normal text-text-on-accent lg:px-8"
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
