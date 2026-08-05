<script setup lang="ts">
import type { CompanyProfileData } from '@features/companies/model/companies-page.types'
import CompanyProfilePage from '@features/companies/ui/CompanyProfilePage.vue'

const route = useRoute()
const config = useRuntimeConfig()
const slug = computed(() => String(route.params.slug))

const { data, error } = await useAsyncData(`company-${slug.value}`, async () =>
  await $fetch<CompanyProfileData>(`/api/companies/${slug.value}`)
)

if (error.value || !data.value) {
  throw createError({ statusCode: 404, statusMessage: 'Company not found' })
}

const success = computed(() => route.query.success === '1')
const errorFlag = computed(() => route.query.error === '1')

useSeoMeta(() => ({
  title: `${data.value?.name || 'Компания'} — ${config.public.siteName}`,
  description: data.value?.description || config.public.siteDescription,
  ogTitle: `${data.value?.name || 'Компания'} — ${config.public.siteName}`,
  ogDescription: data.value?.description || config.public.siteDescription,
  ogType: 'website',
}))
</script>

<template>
  <CompanyProfilePage
    v-if="data"
    :company="data"
    :success="success"
    :error="errorFlag"
  />
</template>
