import type { RouterConfig } from '@nuxt/schema'

export default <RouterConfig>{
  scrollBehavior(to, from, savedPosition) {
    const isMediaStateChange = to.query.play !== from.query.play
      || to.query.view !== from.query.view

    if (to.path === from.path && isMediaStateChange) {
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
