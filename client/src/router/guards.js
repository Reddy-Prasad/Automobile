import { useAuthStore } from '@/stores/authStore'

export function installGuards(router) {
  router.beforeEach(async (to) => {
    const auth = useAuthStore()
    if (!auth.ready) await auth.restoreSession()

    if (to.meta.guestOnly && auth.isSignedIn) {
      return { name: auth.homeName }
    }

    if (to.meta.requiresAuth && !auth.isSignedIn) {
      return {
        name: 'login',
        query: { redirect: to.fullPath },
      }
    }

    if (to.meta.roles?.length && !auth.hasAnyRole(to.meta.roles)) {
      return { name: 'forbidden', query: { from: to.fullPath } }
    }

    return true
  })
}
