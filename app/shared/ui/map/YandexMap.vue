<script setup lang="ts">
import type { MapCoordinates } from '@shared/types/map'

const props = withDefaults(defineProps<{
  coordinates: MapCoordinates
  title: string
  zoom?: number
}>(), {
  zoom: 16,
})

const mapSrc = computed(() => {
  const latitude = Math.min(Math.max(props.coordinates.latitude, -90), 90)
  const longitude = Math.min(Math.max(props.coordinates.longitude, -180), 180)
  const zoom = Math.min(Math.max(Math.round(props.zoom), 1), 21)
  const point = `${longitude},${latitude}`
  const params = new URLSearchParams({
    ll: point,
    pt: `${point},pm2rdm`,
    z: String(zoom),
  })

  return `https://yandex.ru/map-widget/v1/?${params.toString()}`
})
</script>

<template>
  <iframe
    :src="mapSrc"
    :title="title"
    class="h-full w-full border-0"
    loading="lazy"
    allowfullscreen
    referrerpolicy="no-referrer-when-downgrade"
  />
</template>
