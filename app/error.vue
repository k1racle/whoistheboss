<script setup lang="ts">
import type { NuxtError } from '#app'
import ErrorPage from '@features/error/ui/ErrorPage.vue'
import { SEO_SITE_NAME } from '@shared/seo/brand'

const props = defineProps<{
  error: NuxtError
}>()

const statusCode = computed(() => props.error.statusCode || 500)
const isNotFound = computed(() => statusCode.value === 404)
const metaTitle = computed(() => `${isNotFound.value ? 'Страница не найдена' : 'Ошибка сайта'} | ${SEO_SITE_NAME}`)
const metaDescription = computed(() => isNotFound.value
  ? `Запрошенная страница не найдена на сайте ${SEO_SITE_NAME}.`
  : `При загрузке страницы ${SEO_SITE_NAME} произошла ошибка.`)

useSeoMeta({
  title: metaTitle,
  description: metaDescription,
  robots: 'noindex, nofollow',
})
</script>

<template>
  <ErrorPage :status-code="statusCode" />
</template>
