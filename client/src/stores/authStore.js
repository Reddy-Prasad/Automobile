import { defineStore } from 'pinia'

const STORAGE_KEY = 'autodrive.auth'
const demoShopper = { name: 'Alex Rivera', email: 'alex@example.com' }

function readUser() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function persist(user) {
  if (user) sessionStorage.setItem(STORAGE_KEY, JSON.stringify(user))
  else sessionStorage.removeItem(STORAGE_KEY)
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: readUser(),
    status: readUser() ? 'success' : 'initial',
    error: null,
  }),

  getters: {
    isSignedIn: (state) => Boolean(state.user),
    displayName: (state) => state.user?.name ?? 'Guest',
  },

  actions: {
    async signIn(shopper = demoShopper) {
      this.status = 'loading'
      this.error = null

      try {
        await wait(500)
        this.user = { ...shopper }
        this.status = 'success'
        persist(this.user)
        return this.user
      } catch (error) {
        this.error = error
        this.status = 'error'
        throw error
      }
    },

    signOut() {
      this.user = null
      this.status = 'initial'
      this.error = null
      persist(null)
    },
  },
})
