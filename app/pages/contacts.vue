<script setup lang="ts">
import type { ContactPageData } from '@features/contacts/model/contact-page.types'
import ContactsPage from '@features/contacts/ui/ContactsPage.vue'
import { getStaticPageSeo } from '@shared/seo/static-page-seo'
import PageBannerSection from '@shared/ui/page/PageBannerSection.vue'
import { useSiteBanner } from '@shared/ui/page/useSiteBanner'
import { useManagedSeo } from '@shared/seo/use-managed-seo'
import { usePageSeo } from '@shared/seo/use-page-seo'

const route = useRoute()

const fallbackData: ContactPageData = {
  address: '',
  mapSrc: '',
  phone: '',
  email: '',
}

const { data, error: pageError } = await useAsyncData('contacts-page', async () =>
  await $fetch<ContactPageData>('/api/contacts'))

if (pageError.value) {
  throw createError({
    statusCode: pageError.value.statusCode || 503,
    statusMessage: 'Contacts page is unavailable',
  })
}

const seo = await usePageSeo('contacts', getStaticPageSeo('contacts'))

useManagedSeo(seo.value)

const pageData = computed(() => data.value ?? fallbackData)
const success = computed(() => route.query.success === '1')
const error = computed(() => route.query.error === '1')
const { banner, isEnabled: isBannerEnabled } = useSiteBanner()
</script>

<template>
  <div class="flex flex-col">
    <ContactsPage
      :address="pageData.address"
      :map-src="pageData.mapSrc"
      :phone="pageData.phone"
      :email="pageData.email"
      :success="success"
      :error="error"
    />
    <PageBannerSection
      v-if="isBannerEnabled('/contacts')"
      :desktop-image="banner.image"
      :mobile-image="banner.mobileImage"
      :href="banner.link"
    />
  </div>
</template>
