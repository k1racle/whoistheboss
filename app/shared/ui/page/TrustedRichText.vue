<script setup lang="ts">
import { h } from 'vue'

const props = defineProps<{
  html: string
  class?: string
}>()

defineOptions({
  inheritAttrs: false,
})
</script>

<template>
  <component
    :is="h('div', { ...$attrs, class: props.class, innerHTML: props.html })"
  />
</template>
