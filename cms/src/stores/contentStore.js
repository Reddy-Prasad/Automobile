import { defineStore } from 'pinia'
import {
  createContent,
  deleteContent,
  getContent,
  getDashboard,
  listContent,
  transitionContent,
  updateContent,
  updateSingleton,
} from '@/services/contentService'
import { CONTENT_TYPES } from '@/data/contentTypes'

export const useContentStore = defineStore('content', {
  state: () => ({
    dashboard: null,
    items: [],
    current: null,
    status: 'initial',
    error: null,
  }),

  actions: {
    async loadDashboard() {
      this.status = 'loading'
      this.error = null
      try {
        this.dashboard = await getDashboard()
        this.status = 'success'
      } catch (error) {
        this.error = error
        this.status = 'error'
        throw error
      }
    },

    async loadList(type) {
      this.status = 'loading'
      this.error = null
      try {
        this.items = await listContent(type)
        this.status = this.items.length ? 'success' : 'empty'
      } catch (error) {
        this.error = error
        this.status = 'error'
        throw error
      }
    },

    async loadOne(type, id) {
      this.status = 'loading'
      this.error = null
      try {
        this.current = CONTENT_TYPES[type]?.collection
          ? await getContent(type, id)
          : await listContent(type)
        this.status = 'success'
        return this.current
      } catch (error) {
        this.error = error
        this.status = 'error'
        throw error
      }
    },

    async save(type, payload, id) {
      this.status = 'loading'
      this.error = null
      try {
        this.current = CONTENT_TYPES[type]?.collection
          ? await updateContent(type, id, payload)
          : await updateSingleton(type, payload)
        this.status = 'success'
        return this.current
      } catch (error) {
        this.error = error
        this.status = 'error'
        throw error
      }
    },

    async create(type, payload) {
      this.status = 'loading'
      this.error = null
      try {
        this.current = await createContent(type, payload)
        this.status = 'success'
        return this.current
      } catch (error) {
        this.error = error
        this.status = 'error'
        throw error
      }
    },

    async remove(type, id) {
      this.status = 'loading'
      this.error = null
      try {
        await deleteContent(type, id)
        this.items = this.items.filter((item) => item.id !== id)
        this.status = this.items.length ? 'success' : 'empty'
      } catch (error) {
        this.error = error
        this.status = 'error'
        throw error
      }
    },

    async transition(type, id, action) {
      this.status = 'loading'
      this.error = null
      try {
        const result = await transitionContent(type, id, action)
        this.current = result.item
        this.status = 'success'
        return result
      } catch (error) {
        this.error = error
        this.status = 'error'
        throw error
      }
    },
  },
})
