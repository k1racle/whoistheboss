<script setup lang="ts">
import SiteFooter from '@shared/ui/footer/SiteFooter.vue'
import SiteHeader from '@shared/ui/header/SiteHeader.vue'
import { useSiteHeader } from '@shared/ui/header/useSiteHeader'
import LayoutMaster from '@shared/ui/layout/LayoutMaster.vue'

const route = useRoute()
const { logoVisible, syncLogoVisibility } = useSiteHeader()

watch(() => route.path, syncLogoVisibility, { immediate: true })
</script>

<template>
  <LayoutMaster>
    <SiteHeader :logo-visible="logoVisible" />
    <main class="flex-1">
      <slot />
    </main>
    <SiteFooter />
  </LayoutMaster>
</template>
