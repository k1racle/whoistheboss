<script setup lang="ts">
import type { BlogArticleRelatedMaterial } from '@features/blog/model/blog.types'
import BlogRelatedEntrepreneurCard from '@features/blog/ui/BlogRelatedEntrepreneurCard.vue'
import CompanyCatalogCard from '@features/companies/ui/CompanyCatalogCard.vue'

const props = defineProps<{
  material: BlogArticleRelatedMaterial
}>()

defineOptions({
  inheritAttrs: false,
})

const entrepreneur = computed(() => ({
  slug: props.material.slug,
  name: props.material.name,
  title: props.material.title || '',
  photo: props.material.coverImage,
  hoverPhoto: props.material.hoverPhoto,
}))

const company = computed(() => ({
  slug: props.material.slug,
  name: props.material.name,
  type: props.material.title || '',
  coverImage: props.material.coverImage,
}))
</script>

<template>
  <BlogRelatedEntrepreneurCard
    v-if="material.type === 'entrepreneur'"
    :entrepreneur="entrepreneur"
    v-bind="$attrs"
  />
  <CompanyCatalogCard
    v-else
    :company="company"
    v-bind="$attrs"
  />
</template>
