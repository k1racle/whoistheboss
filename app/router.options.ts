import type { RouterConfig } from '@nuxt/schema'

export default <RouterConfig>{
  scrollBehavior(to, from, savedPosition) {
    if (to.path === from.path && to.query.play !== from.query.play) {
      return false
    }

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
