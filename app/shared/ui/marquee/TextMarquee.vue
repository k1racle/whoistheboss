<script setup lang="ts">
const props = withDefaults(defineProps<{
  text: string
  durationSeconds?: number
  repeat?: number
}>(), {
  durationSeconds: 48,
  repeat: 4,
})

const visualText = computed(() => Array.from({ length: props.repeat }, () => props.text).join('    '))
</script>

<template>
  <section class="overflow-hidden border-y border-accent bg-accent py-3.5" aria-label="Бегущая строка">
    <span class="sr-only">{{ text }}</span>
    <div
      aria-hidden="true"
      class="text-marquee-track flex w-max whitespace-pre will-change-transform"
      :data-text="visualText"
      :style="{ '--marquee-duration': `${durationSeconds}s` }"
    />
  </section>
</template>

<style scoped>
.text-marquee-track {
  animation: textMarquee var(--marquee-duration) linear infinite;
}

.text-marquee-track::before,
.text-marquee-track::after {
  content: attr(data-text);
  padding-inline: 1.25rem;
  font-family: var(--font-sans);
  font-size: 1.5rem;
  font-weight: 700;
  line-height: 1.75rem;
  text-transform: uppercase;
  color: var(--color-text-on-accent);
}

@media (min-width: 1024px) {
  .text-marquee-track::before,
  .text-marquee-track::after {
    padding-inline: 2rem;
  }
}

@keyframes textMarquee {
  to {
    transform: translateX(-50%);
  }
}
</style>
