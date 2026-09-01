export interface SlideMetric {
  offsetLeft: number
  offsetWidth: number
}

export function getClosestSlideIndex(
  slides: SlideMetric[],
  scrollLeft: number,
  viewportWidth: number,
  itemsCount = slides.length,
) {
  const availableSlides = slides.slice(0, Math.max(0, itemsCount))
  if (!availableSlides.length || viewportWidth <= 0) return 0

  const viewportCenter = scrollLeft + viewportWidth / 2
  let closestIndex = 0
  let closestDistance = Number.POSITIVE_INFINITY

  availableSlides.forEach((slide, index) => {
    const slideCenter = slide.offsetLeft + slide.offsetWidth / 2
    const distance = Math.abs(slideCenter - viewportCenter)

    if (distance < closestDistance) {
      closestIndex = index
      closestDistance = distance
    }
  })

  return closestIndex
}

export function getCenteredSlideScrollLeft(slide: SlideMetric, viewportWidth: number) {
  return Math.max(0, slide.offsetLeft - (viewportWidth - slide.offsetWidth) / 2)
}
