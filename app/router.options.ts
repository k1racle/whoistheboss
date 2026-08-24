import type { RouterConfig } from '@nuxt/schema'

export default <RouterConfig>{
  scrollBehavior(to, _from, savedPosition) {
    if (savedPosition) {
      return {
        ...savedPosition,
        behavior: 'instant',
      }
    }

    if (to.hash) {
      return { el: to.hash }
    }

    return {
      left: 0,
      top: 0,
      behavior: 'instant',
    }
  },
}
