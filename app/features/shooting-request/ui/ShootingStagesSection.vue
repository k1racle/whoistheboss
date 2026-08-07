<script setup lang="ts">
import type { ShootingStageItem } from '@features/shooting-request/model/shooting-page.types'
import ShootingStageCard from '@features/shooting-request/ui/ShootingStageCard.vue'
import PinnedHorizontalTrackSection from '@shared/ui/scroll/PinnedHorizontalTrackSection.vue'

defineProps<{
  title: string
  stages: ShootingStageItem[]
}>()
</script>

<template>
  <PinnedHorizontalTrackSection
    section-id="stages"
    :title="title"
    aria-label="Этапы участия в проекте"
  >
    <template v-for="stage in stages" :key="stage.index">
      <ShootingStageCard :stage="stage" variant="summary" />
      <ShootingStageCard :stage="stage" variant="detail" />
    </template>
  </PinnedHorizontalTrackSection>
</template>
