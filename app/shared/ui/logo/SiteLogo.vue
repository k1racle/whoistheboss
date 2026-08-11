<script setup lang="ts">
withDefaults(defineProps<{
  src?: string
}>(), {
  src: '/images/image-29.svg',
})
</script>

<template>
  <img
    :src="src"
    alt="Кто здесь главный?"
    width="103"
    height="54"
    class="h-9 w-auto sm:h-10 lg:h-11"
  >
</template>
