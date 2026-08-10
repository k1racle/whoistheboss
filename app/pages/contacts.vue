<script setup lang="ts">
import type { ContactPageData } from '@features/contacts/model/contact-page.types'
import ContactsPage from '@features/contacts/ui/ContactsPage.vue'
import PageBannerSection from '@shared/ui/page/PageBannerSection.vue'
import { useSiteBanner } from '@shared/ui/page/useSiteBanner'

const route = useRoute()
const config = useRuntimeConfig()

const fallbackData: ContactPageData = {
  address: '',
  mapSrc: '',
  phone: '',
  email: '',
}

const { data } = await useAsyncData('contacts-page', async () => {
  try {
    return await $fetch<ContactPageData>('/api/contacts')
  }
  catch {
    return fallbackData
  }
})

useSeoMeta({
  title: `Контакты — ${config.public.siteName}`,
  description: config.public.siteDescription,
  ogTitle: `Контакты — ${config.public.siteName}`,
  ogDescription: config.public.siteDescription,
})

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
