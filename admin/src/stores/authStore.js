import { defineStore } from 'pinia'
import { clearSession, readSession, writeSession } from '@/auth/session'
import { hasPermission, roleLabel } from '@/data/roles'
import { getCurrentUser, login, logout } from '@/services/authService'

export const useAuthStore = defineStore('auth', {
  state: () => {
    const saved = readSession()
    return {
      token: saved.token,
      user: saved.user,
      ready: false,
      status: saved.user ? 'success' : 'initial',
      error: null,
    }
  },

  getters: {
    isSignedIn: (state) => Boolean(state.user && state.token),
    displayName: (state) => state.user?.name ?? 'Guest',
    role: (state) => state.user?.role ?? '',
    roleName: (state) => (state.user ? roleLabel(state.user.role) : 'Guest'),
  },

  actions: {
    can(permission) {
      return hasPermission(this.role, permission)
    },

    hasAnyRole(roles = []) {
      return Boolean(this.user && roles.includes(this.user.role))
    },

    remember({ token, user }) {
      this.token = token
      this.user = user
      this.status = 'success'
      this.error = null
      writeSession({ token, user })
    },

    clear() {
      this.token = null
      this.user = null
      this.status = 'initial'
      this.error = null
      clearSession()
    },

    async login(credentials) {
      this.status = 'loading'
      this.error = null
      try {
        const session = await login(credentials)
        this.remember(session)
        return session.user
      } catch (error) {
        this.error = error
        this.status = 'error'
        throw error
      }
    },

    async logout() {
      try {
        await logout()
      } catch {
        // Local session still has to die even if the mock POST fails.
      }
      this.clear()
    },

    async restoreSession() {
      if (this.ready) return
      if (!this.token) {
        this.ready = true
        return
      }

      try {
        this.user = await getCurrentUser()
        writeSession({ token: this.token, user: this.user })
        this.status = 'success'
      } catch {
        this.clear()
      } finally {
        this.ready = true
      }
    },
  },
})
