<script setup lang="ts">
import { ROUTES } from '@shared/navigation'

const route = useRoute()
const slug = String(route.params.slug)

const { error } = await useAsyncData(`reel-${slug}`, async () =>
  await $fetch(`/api/reels/${slug}`)
)

if (error.value) {
  throw createError({ statusCode: 404, statusMessage: 'Reel not found' })
}

await navigateTo({
  path: ROUTES.REELS,
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
