<script setup lang="ts">
import SiteFooter from '@shared/ui/footer/SiteFooter.vue'
import SiteHeader from '@shared/ui/header/SiteHeader.vue'
import { useSiteHeader } from '@shared/ui/header/useSiteHeader'
import LayoutMaster from '@shared/ui/layout/LayoutMaster.vue'

const { logoVisible } = useSiteHeader()
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
