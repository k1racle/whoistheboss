<script setup lang="ts">
import { ROUTES } from '@shared/navigation'

const route = useRoute()
const slug = computed(() => String(route.params.slug))
const city = typeof route.params.city === 'string' ? route.params.city : ''

await navigateTo(city ? `/${city}${ROUTES.COMPANY(slug.value)}` : ROUTES.COMPANY(slug.value), {
  redirectCode: 301,
  replace: true,
})
</script>
