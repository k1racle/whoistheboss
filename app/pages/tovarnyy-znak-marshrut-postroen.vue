<script setup lang="ts">
import type { TrademarkPageData } from '@features/trademark/model/trademark-page.types'
import TrademarkPage from '@features/trademark/ui/TrademarkPage.vue'
import { ROUTES } from '@shared/navigation'

const config = useRuntimeConfig()
const { data, error } = await useAsyncData('trademark-page', () => $fetch<TrademarkPageData>('/api/trademark-page'))

if (error.value || !data.value) {
  throw createError({ statusCode: error.value?.statusCode || 503, statusMessage: 'Trademark page is unavailable' })
}

const page = computed(() => data.value!)

useSeoMeta({
  title: page.value.seoTitle,
  description: page.value.seoDescription,
  ogTitle: page.value.seoTitle,
  ogDescription: page.value.seoDescription,
  ogType: 'website',
})
useHead({
  link: [{ rel: 'canonical', href: `${config.public.siteUrl}${ROUTES.TRADEMARK}` }],
})
defineBreadcrumb({
  itemListElement: [
    { name: 'Главная', item: ROUTES.LANDING },
    { name: 'Товарный знак «Маршрут Построен»', item: ROUTES.TRADEMARK },
  ],
})
</script>

<template>
  <TrademarkPage :page="page" />
</template>
