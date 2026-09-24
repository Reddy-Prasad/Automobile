import { defineStore } from 'pinia'
import { failNextRequest } from '@/api/http'
import { getVehicle, listVehicles, patchVehicle } from '@/services/vehicleService'

export const useVehicleStore = defineStore('vehicles', {
  state: () => ({
    items: [],
    current: null,
    listStatus: 'initial',
    listError: null,
    detailStatus: 'initial',
    detailError: null,
  }),

  getters: {
    count: (state) => state.items.length,
    featured: (state) => state.items.filter((vehicle) => vehicle.featured).slice(0, 4),
    newest: (state) => state.items.filter((vehicle) => vehicle.condition === 'new').slice(0, 4),
    used: (state) => state.items.filter((vehicle) => vehicle.condition !== 'new').slice(0, 4),
    byId: (state) => (id) =>
      state.items.find((vehicle) => String(vehicle.id) === String(id)) ?? null,
  },

  actions: {
    upsert(vehicle) {
      if (!vehicle) return
      const index = this.items.findIndex((item) => String(item.id) === String(vehicle.id))
      if (index === -1) this.items.push(vehicle)
      else this.items[index] = vehicle
      if (this.current && String(this.current.id) === String(vehicle.id)) {
        this.current = vehicle
      }
    },

    async loadVehicles({ force = false } = {}) {
      if (this.items.length && this.listStatus === 'success' && !force) {
        return this.items
      }

      this.listStatus = 'loading'
      this.listError = null

      try {
        this.items = await listVehicles()
        this.listStatus = this.items.length ? 'success' : 'empty'
        return this.items
      } catch (error) {
        this.listError = error
        this.listStatus = 'error'
        throw error
      }
    },

    async loadVehicle(id) {
      const cached = this.byId(id)
      if (cached) {
        this.current = cached
        this.detailStatus = 'success'
      } else {
        this.current = null
        this.detailStatus = 'loading'
      }

      this.detailError = null

      try {
        const fresh = await getVehicle(id)
        this.current = fresh
        this.upsert(fresh)
        this.detailStatus = 'success'
        if (this.items.length < 2) {
          this.loadVehicles().catch(() => {})
        }
        return fresh
      } catch (error) {
        this.detailError = error
        if (!cached) {
          this.current = null
          this.detailStatus = error.status === 404 ? 'empty' : 'error'
        }
        throw error
      }
    },

    async saveVehicle(id, changes) {
      const updated = await patchVehicle(id, changes)
      this.upsert(updated)
      return updated
    },

    simulateError() {
      failNextRequest()
      return this.loadVehicles({ force: true })
    },
  },
})
