import { defineStore } from 'pinia'

function applySeo(seo) {
  if (!seo) return
  if (seo.title) document.title = seo.title

  if (!seo.description) return
  let meta = document.querySelector('meta[name="description"]')
  if (!meta) {
    meta = document.createElement('meta')
    meta.setAttribute('name', 'description')
    document.head.appendChild(meta)
  }
  meta.setAttribute('content', seo.description)
}

export const usePublishedStore = defineStore('published', {
  state: () => ({
    snapshot: null,
    loaded: false,
  }),

  getters: {
    offers: (state) => (state.snapshot?.offers?.length ? state.snapshot.offers : null),
    banners: (state) => (state.snapshot?.banners?.length ? state.snapshot.banners : null),
    navigation: (state) =>
      state.snapshot?.navigation?.length ? state.snapshot.navigation : null,
    footer: (state) => state.snapshot?.footer ?? null,
    homepage: (state) => state.snapshot?.homepage ?? null,
    seo: (state) => state.snapshot?.seo ?? null,
    publishedAt: (state) => state.snapshot?.publishedAt ?? null,
  },

  actions: {
    async load() {
      try {
        const response = await fetch('/cms-published.json', { cache: 'no-store' })
        if (response.ok) {
          this.snapshot = await response.json()
          applySeo(this.snapshot?.seo)
        }
      } catch {
        this.snapshot = null
      } finally {
        this.loaded = true
      }
    },
  },
})
