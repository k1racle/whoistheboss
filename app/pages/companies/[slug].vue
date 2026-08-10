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

const company = data.value
const title = `${company.name} — ${config.public.siteName}`
const description = company.description || config.public.siteDescription
const socialImage = company.manifestSquareImage || company.aboutPhoto || undefined

const success = computed(() => route.query.success === '1')
const errorFlag = computed(() => route.query.error === '1')

useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description,
  ogType: 'website',
  ogImage: socialImage,
  twitterCard: socialImage ? 'summary_large_image' : 'summary',
  twitterImage: socialImage,
})

useSchemaOrg([
  defineOrganization({
    name: company.name,
    description,
    url: `/companies/${company.slug}`,
    address: company.address
      ? {
          streetAddress: company.address,
          addressLocality: company.city || undefined,
        }
      : undefined,
    telephone: company.phone || undefined,
    email: company.email || undefined,
  }),
  defineBreadcrumb({
    itemListElement: [
      { name: 'Главная', item: '/' },
      { name: 'Компании', item: '/companies' },
      { name: company.name },
    ],
  }),
])
</script>

<template>
  <CompanyProfilePage
    v-if="data"
    :company="data"
    :success="success"
    :error="errorFlag"
  />
</template>
