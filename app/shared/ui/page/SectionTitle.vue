<script setup lang="ts">
withDefaults(defineProps<{
  tag?: 'h1' | 'h2' | 'h3'
}>(), {
  tag: 'h2',
})
</script>

<template>
  <component :is="tag" class="whitespace-pre-line text-balance font-display text-[42px] font-black uppercase leading-[0.88] tracking-[-0.03em] text-text sm:text-[clamp(3rem,8vw,6rem)]">
    <slot />
  </component>
</template>
