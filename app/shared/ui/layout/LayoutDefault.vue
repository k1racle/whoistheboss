<script setup lang="ts">
import SiteFooter from '@shared/ui/footer/SiteFooter.vue'
import SiteHeader from '@shared/ui/header/SiteHeader.vue'
import LayoutMaster from '@shared/ui/layout/LayoutMaster.vue'
import type { SiteFooterData } from '@shared/types/site-footer'
import type { PresenceCity } from '@shared/types/city'
import CookieConsentBanner from '@shared/ui/privacy/CookieConsentBanner.vue'

const { data: footerData } = await useFetch<SiteFooterData>('/api/site-footer', {
  key: 'site-footer',
})
const { data: citiesData } = await useFetch<PresenceCity[]>('/api/cities', {
  key: 'presence-cities-request',
})
</script>

<template>
  <LayoutMaster>
    <SiteHeader
      :social-links="footerData?.socialLinks"
      :cities="citiesData || []"
    />
    <main class="flex-1">
      <slot />
    </main>
    <SiteFooter
      :social-links="footerData?.socialLinks"
      :meta-items="footerData?.metaItems"
    />
    <CookieConsentBanner />
  </LayoutMaster>
</template>
