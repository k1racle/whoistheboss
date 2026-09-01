<script setup lang="ts">
import type { TrademarkPageData } from '@features/trademark/model/trademark-page.types'
import TrademarkPage from '@features/trademark/ui/TrademarkPage.vue'
import { ROUTES } from '@shared/navigation'
import { useManagedSeo } from '@shared/seo/use-managed-seo'

const { data, error } = await useAsyncData('trademark-page', () => $fetch<TrademarkPageData>('/api/trademark-page'))

if (error.value || !data.value) {
  throw createError({ statusCode: error.value?.statusCode || 503, statusMessage: 'Trademark page is unavailable' })
}

const page = computed(() => data.value!)

useManagedSeo({
  title: page.value.seoTitle,
  description: page.value.seoDescription,
})
defineBreadcrumb({
  itemListElement: [
    { name: 'Главная', item: ROUTES.LANDING },
    { name: 'Товарный знак МАРШРУТ ПОСТРОЕН МЕДИАГИД', item: ROUTES.TRADEMARK },
  ],
})
</script>

<template>
  <TrademarkPage :page="page" />
</template>
