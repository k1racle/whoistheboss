<script setup lang="ts">
import LandingAboutSection from '@features/landing/ui/sections/LandingAboutSection.vue'
import LandingArticles from '@features/landing/ui/sections/LandingArticles.vue'
import LandingAudienceSection from '@features/landing/ui/sections/LandingAudienceSection.vue'
import LandingFeaturedHeroSection from '@features/landing/ui/sections/LandingFeaturedHeroSection.vue'
import LandingHeroSection from '@features/landing/ui/sections/LandingHeroSection.vue'
import LandingOurHeroesSection from '@features/landing/ui/sections/LandingOurHeroesSection.vue'
import { useSiteHeader } from '@shared/ui/header/useSiteHeader'

const { logoVisible } = useSiteHeader()
logoVisible.value = false

const aboutSectionRef = ref<HTMLElement | null>(null)

const updateHeaderLogoVisibility = () => {
  const about = aboutSectionRef.value
  if (!about) return

  const headerHeight = document.querySelector('header')?.getBoundingClientRect().height ?? 0
  logoVisible.value = about.getBoundingClientRect().top <= headerHeight
}

onMounted(() => {
  updateHeaderLogoVisibility()
  window.addEventListener('scroll', updateHeaderLogoVisibility, { passive: true })
  window.addEventListener('resize', updateHeaderLogoVisibility)
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', updateHeaderLogoVisibility)
  window.removeEventListener('resize', updateHeaderLogoVisibility)
  logoVisible.value = true
})
</script>

<template>
  <div class="flex flex-col">
    <LandingHeroSection />
    <div ref="aboutSectionRef">
      <LandingAboutSection />
    </div>
    <LandingFeaturedHeroSection />
    <LandingOurHeroesSection />
    <LandingArticles />
    <LandingAudienceSection />
  </div>
</template>
