<script setup lang="ts">
import { ROUTES } from '@shared/navigation'

const route = useRoute()
const slug = computed(() => String(route.params.slug))

await navigateTo(ROUTES.COMPANY(slug.value), {
  redirectCode: 301,
  replace: true,
})
</script>
