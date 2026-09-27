import { defineStore } from 'pinia'
import {
  getDashboard,
  getReports,
  getSettings,
  listBoard,
  listDealers,
  listUsers,
  patchBoardItem,
  patchUser,
  updateSettings,
} from '@/services/operationsService'

export const useOperationsStore = defineStore('operations', {
  state: () => ({
    dashboard: null,
    items: [],
    reports: null,
    settings: null,
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
      }
    },

    async loadBoard(type) {
      this.status = 'loading'
      this.error = null
      try {
        this.items = type === 'dealers' ? await listDealers() : await listBoard(type)
        this.status = this.items.length ? 'success' : 'empty'
      } catch (error) {
        this.error = error
        this.status = 'error'
      }
    },

    async updateItem(type, id, body) {
      const updated = await patchBoardItem(type, id, body)
      const index = this.items.findIndex((item) => item.id === id)
      if (index >= 0) this.items[index] = updated
      return updated
    },

    async loadUsers() {
      this.status = 'loading'
      this.error = null
      try {
        this.items = await listUsers()
        this.status = 'success'
      } catch (error) {
        this.error = error
        this.status = 'error'
      }
    },

    async changeRole(id, role) {
      const updated = await patchUser(id, { role })
      const index = this.items.findIndex((item) => item.id === id)
      if (index >= 0) this.items[index] = updated
    },

    async loadReports() {
      this.status = 'loading'
      this.error = null
      try {
        this.reports = await getReports()
        this.status = 'success'
      } catch (error) {
        this.error = error
        this.status = 'error'
      }
    },

    async loadSettings() {
      this.settings = await getSettings()
      return this.settings
    },

    async saveSettings(body) {
      this.settings = await updateSettings(body)
      return this.settings
    },
  },
})
