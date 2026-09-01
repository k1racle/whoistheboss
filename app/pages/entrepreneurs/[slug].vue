<script setup lang="ts">
import type { EntrepreneurDetailData } from '@features/entrepreneurs/model/entrepreneur.types'
import EntrepreneurProfilePage from '@features/entrepreneurs/ui/EntrepreneurProfilePage.vue'
import { buildEntrepreneurSeoDescription, buildEntrepreneurSeoTitle } from '@shared/seo/content'
import { useManagedSeo } from '@shared/seo/use-managed-seo'

const route = useRoute()
const slug = computed(() => String(route.params.slug))
const city = computed(() => typeof route.params.city === 'string' ? route.params.city : undefined)

const { data, error } = await useAsyncData(`entrepreneur-${city.value || 'all'}-${slug.value}`, async () =>
  await $fetch<EntrepreneurDetailData>(`/api/entrepreneurs/${slug.value}`, { query: { city: city.value } })
)

if (error.value || !data.value) {
  throw createError({ statusCode: 404, statusMessage: 'Entrepreneur not found' })
}

const entrepreneur = data.value
const title = buildEntrepreneurSeoTitle(entrepreneur)
const description = buildEntrepreneurSeoDescription(entrepreneur)
const profileImage = entrepreneur.socialImage || entrepreneur.aboutGalleryImages[0]

const success = computed(() => route.query.success === '1')
const errorFlag = computed(() => route.query.error === '1')

const seo = useManagedSeo({ title, description, image: profileImage, type: 'profile' })
const personId = `${seo.canonicalUrl}#person`
const personSchema = definePerson({
  '@id': personId,
  name: entrepreneur.name,
  description: seo.description,
  image: seo.imageUrl,
  url: `/entrepreneurs/${entrepreneur.slug}`,
  jobTitle: entrepreneur.title,
})

useSchemaOrg([
  personSchema,
  defineWebPage({
    '@id': `${seo.canonicalUrl}#webpage`,
    description: seo.description,
    about: personSchema,
  }),
  defineBreadcrumb({
    itemListElement: [
      { name: 'Главная', item: '/' },
      { name: 'Предприниматели', item: '/entrepreneurs' },
      { name: entrepreneur.name },
    ],
  }),
])
</script>

<template>
  <EntrepreneurProfilePage
    v-if="data"
    :entrepreneur="data"
    :success="success"
    :error="errorFlag"
  />
</template>
