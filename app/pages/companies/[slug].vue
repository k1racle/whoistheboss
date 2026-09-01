<script setup lang="ts">
import type { CompanyProfileData } from '@features/companies/model/companies-page.types'
import CompanyProfilePage from '@features/companies/ui/CompanyProfilePage.vue'
import { buildCompanySeoDescription, buildCompanySeoTitle } from '@shared/seo/content'
import { useManagedSeo } from '@shared/seo/use-managed-seo'

const route = useRoute()
const config = useRuntimeConfig()
const slug = computed(() => String(route.params.slug))
const city = computed(() => typeof route.params.city === 'string' ? route.params.city : undefined)

const { data, error } = await useAsyncData(`company-${city.value || 'all'}-${slug.value}`, async () =>
  await $fetch<CompanyProfileData>(`/api/companies/${slug.value}`, { query: { city: city.value } })
)

if (error.value || !data.value) {
  throw createError({ statusCode: 404, statusMessage: 'Company not found' })
}

const company = data.value
const title = buildCompanySeoTitle(company)
const description = buildCompanySeoDescription(company)
const socialImage = company.socialImage || company.manifestSquareImage || company.aboutPhoto || undefined

const success = computed(() => route.query.success === '1')
const errorFlag = computed(() => route.query.error === '1')

const seo = useManagedSeo({ title, description, image: socialImage })
const companyId = `${seo.canonicalUrl}#organization`
const founderId = company.owner
  ? new URL(`/entrepreneurs/${company.owner.slug}#person`, config.public.siteUrl).href
  : undefined
const founderSchema = company.owner
  ? definePerson({
      '@id': founderId,
      name: company.owner.name,
      url: `/entrepreneurs/${company.owner.slug}`,
      image: company.owner.photo || undefined,
    })
  : undefined
const companySchema = defineOrganization({
  '@id': companyId,
  name: company.name,
  description: seo.description,
  url: `/companies/${company.slug}`,
  image: seo.imageUrl,
  sameAs: company.website ? [company.website] : undefined,
  address: company.address
    ? {
        streetAddress: company.address,
        addressLocality: company.city || undefined,
        addressCountry: 'RU',
      }
    : undefined,
  telephone: company.phone || undefined,
  email: company.email || undefined,
  founder: founderSchema,
})

useSchemaOrg([
  companySchema,
  defineWebPage({
    '@id': `${seo.canonicalUrl}#webpage`,
    description: seo.description,
    about: companySchema,
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
