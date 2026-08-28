<script setup lang="ts">
useHead({
  noscript: [
    {
      innerHTML:
        '<div><img src="https://mc.yandex.ru/watch/112035140" style="position:absolute; left:-9999px;" alt="" /></div>',
    },
  ],
})
</script>

<template>
  <NuxtLoadingIndicator color="var(--color-accent)" />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
