<script setup lang="ts">
import { splitPlainTextLines } from '@shared/lib/typography'

const props = defineProps<{
  text: string
}>()

const lines = computed(() => splitPlainTextLines(props.text))
</script>

<template>
  <template
    v-for="(line, index) in lines"
    :key="index"
  >
    <br v-if="index > 0">
    <span v-if="line">{{ line }}</span>
  </template>
</template>
