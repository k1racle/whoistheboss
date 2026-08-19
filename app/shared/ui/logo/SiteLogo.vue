<script setup lang="ts">
withDefaults(defineProps<{
  src?: string
}>(), {
  src: '',
})
</script>

<template>
  <img
    v-if="src"
    :src="src"
    alt="Маршрут Построен"
    width="103"
    height="54"
    class="h-9 w-auto sm:h-10 lg:h-11"
  >
  <svg
    v-else
    viewBox="0 0 103 54"
    role="img"
    aria-label="Маршрут Построен"
    class="h-9 w-auto sm:h-10 lg:h-11"
  >
    <rect width="103" height="54" fill="currentColor" class="text-accent" />
    <text x="8" y="23" fill="white" font-family="Arial, sans-serif" font-size="13" font-weight="900">МАРШРУТ</text>
    <text x="8" y="41" fill="white" font-family="Arial, sans-serif" font-size="15" font-weight="900">ПОСТРОЕН</text>
  </svg>
</template>
