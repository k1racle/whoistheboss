<script setup lang="ts">
import type { ContactPageData } from '@features/contacts/model/contact-page.types'
import { SOCIAL_LINKS } from '@shared/social'

defineProps<ContactPageData & {
  success?: boolean
  error?: boolean
}>()
</script>

<template>
  
</template>
