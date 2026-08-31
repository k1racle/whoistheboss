<script setup lang="ts">
defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<{
  as?: string
  text: string
  minFontSize?: number
}>(), {
  as: 'div',
  minFontSize: 24,
})

const textRef = ref<HTMLElement | null>(null)
let resizeObserver: ResizeObserver | undefined
let fitFrame = 0

const fitText = () => {
  window.cancelAnimationFrame(fitFrame)
  fitFrame = window.requestAnimationFrame(() => {
    const element = textRef.value
    const container = element?.parentElement
    if (!element || !container || container.clientWidth === 0) return

    element.style.removeProperty('font-size')

    const availableWidth = Math.min(element.clientWidth, container.clientWidth) - 2
    const naturalWidth = element.scrollWidth
    if (naturalWidth <= availableWidth) return

    const naturalFontSize = Number.parseFloat(window.getComputedStyle(element).fontSize)
    const fittedFontSize = Math.max(
      props.minFontSize,
      naturalFontSize * availableWidth / naturalWidth,
    )
    element.style.fontSize = `${fittedFontSize}px`
  })
}

onMounted(() => {
  const container = textRef.value?.parentElement
  resizeObserver = new ResizeObserver(fitText)
  if (container) resizeObserver.observe(container)

  fitText()
  void document.fonts.ready.then(fitText)
})

watch(() => props.text, () => {
  void nextTick(fitText)
})

onBeforeUnmount(() => {
  window.cancelAnimationFrame(fitFrame)
  resizeObserver?.disconnect()
})
</script>

<template>
  <component :is="as" ref="textRef" v-bind="$attrs">
    <slot>{{ text }}</slot>
  </component>
</template>
