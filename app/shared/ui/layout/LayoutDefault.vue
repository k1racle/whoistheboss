<script setup lang="ts">
import SiteFooter from '@shared/ui/footer/SiteFooter.vue'
import SiteHeader from '@shared/ui/header/SiteHeader.vue'
import LayoutMaster from '@shared/ui/layout/LayoutMaster.vue'
import type { SiteFooterData } from '@shared/types/site-footer'

const { data: footerData } = await useFetch<SiteFooterData>('/api/site-footer', {
  key: 'site-footer',
})
</script>

<template>
  <LayoutMaster>
    <SiteHeader />
    <main class="flex-1">
      <slot />
    </main>
    <SiteFooter
      :social-links="footerData?.socialLinks"
      :meta-items="footerData?.metaItems"
    />
  </LayoutMaster>
</template>
