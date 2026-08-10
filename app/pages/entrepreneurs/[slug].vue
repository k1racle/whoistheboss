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

const entrepreneur = data.value
const title = `${entrepreneur.name} — ${config.public.siteName}`
const description = entrepreneur.quote || entrepreneur.title || config.public.siteDescription
const profileImage = entrepreneur.aboutGalleryImages[0]

const success = computed(() => route.query.success === '1')
const errorFlag = computed(() => route.query.error === '1')

useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description,
  ogType: 'profile',
  ogImage: profileImage,
  twitterCard: profileImage ? 'summary_large_image' : 'summary',
  twitterImage: profileImage,
})

useSchemaOrg([
  definePerson({
    name: entrepreneur.name,
    description,
    image: profileImage,
    url: `/entrepreneurs/${entrepreneur.slug}`,
    jobTitle: entrepreneur.title,
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
