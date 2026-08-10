<script setup lang="ts">
import SiteFooter from '@shared/ui/footer/SiteFooter.vue'
import SiteHeader from '@shared/ui/header/SiteHeader.vue'
import { useSiteHeader } from '@shared/ui/header/useSiteHeader'
import LayoutMaster from '@shared/ui/layout/LayoutMaster.vue'
import type { SiteFooterData } from '@shared/types/site-footer'

const route = useRoute()
const { logoVisible, syncLogoVisibility } = useSiteHeader()
const { data: footerData } = await useFetch<SiteFooterData>('/api/site-footer', {
  key: 'site-footer',
})

watch(() => route.path, syncLogoVisibility, { immediate: true })
</script>

<template>
  <LayoutMaster>
    <SiteHeader :logo-visible="logoVisible" />
    <main class="flex-1">
      <slot />
    </main>
    <SiteFooter
      :social-links="footerData?.socialLinks"
      :meta-items="footerData?.metaItems"
    />
  </LayoutMaster>
</template>
