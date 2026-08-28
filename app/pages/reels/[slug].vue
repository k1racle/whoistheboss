<script setup lang="ts">
import { ROUTES } from '@shared/navigation'

const route = useRoute()
const slug = String(route.params.slug)
const city = typeof route.params.city === 'string' ? route.params.city : undefined

const { error } = await useAsyncData(`reel-${city || 'all'}-${slug}`, async () =>
  await $fetch(`/api/reels/${slug}`, { query: { city } })
)

if (error.value) {
  throw createError({ statusCode: 404, statusMessage: 'Reel not found' })
}

await navigateTo({
  path: city ? `/${city}${ROUTES.REELS}` : ROUTES.REELS,
  query: {
    play: slug,
  },
}, {
  redirectCode: 302,
  replace: true,
})
</script>

<template>
  <div />
</template>
