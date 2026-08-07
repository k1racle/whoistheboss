<template>
  <div
    class="relative min-h-[280px] overflow-hidden bg-[#d6d8dc] sm:min-h-[340px]"
    aria-hidden="true"
  >
    <span
      class="banner-skeleton__shimmer absolute inset-y-0 right-[-55%] w-[55%] bg-linear-to-r from-transparent via-accent/40 to-transparent will-change-transform"
    />
  </div>
</template>

<style scoped>
.banner-skeleton__shimmer {
  animation: banner-skeleton-shimmer 2s ease-in-out infinite;
}

@keyframes banner-skeleton-shimmer {
  from {
    transform: translateX(0);
  }

  to {
    transform: translateX(-300%);
  }
}

@media (prefers-reduced-motion: reduce) {
  .banner-skeleton__shimmer {
    animation: none;
  }
}
</style>
