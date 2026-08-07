<script setup lang="ts">
import { ROUTES } from '@shared/navigation'

await navigateTo(ROUTES.COMPANIES, {
  redirectCode: 301,
  replace: true,
})
</script>

<template>
  <div />
</template>
