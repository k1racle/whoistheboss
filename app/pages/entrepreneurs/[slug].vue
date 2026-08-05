<script setup lang="ts">
import type { EntrepreneurDetailData } from '@features/entrepreneurs/model/entrepreneur.types'
import EntrepreneurProfilePage from '@features/entrepreneurs/ui/EntrepreneurProfilePage.vue'

const route = useRoute()
const config = useRuntimeConfig()
const slug = computed(() => String(route.params.slug))

const { data, error } = await useAsyncData(`entrepreneur-${slug.value}`, async () =>
  await $fetch<EntrepreneurDetailData>(`/api/entrepreneurs/${slug.value}`)
)

if (error.value || !data.value) {
  throw createError({ statusCode: 404, statusMessage: 'Entrepreneur not found' })
}

const success = computed(() => route.query.success === '1')
const errorFlag = computed(() => route.query.error === '1')

useSeoMeta(() => ({
  title: `${data.value?.name || 'Предприниматель'} — ${config.public.siteName}`,
  description: data.value?.quote || data.value?.title || config.public.siteDescription,
  ogTitle: `${data.value?.name || 'Предприниматель'} — ${config.public.siteName}`,
  ogDescription: data.value?.quote || data.value?.title || config.public.siteDescription,
  ogType: 'profile',
}))
</script>

<template>
  <EntrepreneurProfilePage
    v-if="data"
    :entrepreneur="data"
    :success="success"
    :error="errorFlag"
  />
</template>
