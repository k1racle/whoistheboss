<script setup lang="ts">
import { ROUTES } from '@shared/navigation'

const route = useRoute()
const city = typeof route.params.city === 'string' ? route.params.city : ''

await navigateTo(city ? `/${city}${ROUTES.COMPANIES}` : ROUTES.COMPANIES, {
  redirectCode: 301,
  replace: true,
})
</script>

<template>
  <div />
</template>
