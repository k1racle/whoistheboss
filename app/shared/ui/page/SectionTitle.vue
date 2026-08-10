<script setup lang="ts">
withDefaults(defineProps<{
  tag?: 'h1' | 'h2' | 'h3'
}>(), {
  tag: 'h2',
})
</script>

<template>
  <component :is="tag" class="text-balance font-display text-[clamp(3rem,8vw,6rem)] font-black uppercase leading-[0.88] tracking-[-0.03em] text-text">
    <slot />
  </component>
</template>
