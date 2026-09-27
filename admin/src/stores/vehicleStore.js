import { defineStore } from 'pinia'
import {
  createVehicle,
  deleteVehicle,
  getVehicle,
  listVehicles,
  publishVehicle,
  unpublishVehicle,
  updateVehicle,
} from '@/services/vehicleService'

export const useVehicleStore = defineStore('vehicles', {
  state: () => ({
    items: [],
    current: null,
    status: 'initial',
    error: null,
  }),

  actions: {
    async loadList() {
      this.status = 'loading'
      this.error = null
      try {
        this.items = await listVehicles()
        this.status = this.items.length ? 'success' : 'empty'
      } catch (error) {
        this.error = error
        this.status = 'error'
        throw error
      }
    },

    async loadOne(id) {
      this.status = 'loading'
      this.error = null
      try {
        this.current = await getVehicle(id)
        this.status = 'success'
        return this.current
      } catch (error) {
        this.error = error
        this.status = 'error'
        throw error
      }
    },

    async create(payload) {
      this.current = await createVehicle(payload)
      return this.current
    },

    async save(id, payload) {
      this.current = await updateVehicle(id, payload)
      return this.current
    },

    async remove(id) {
      await deleteVehicle(id)
      this.items = this.items.filter((item) => item.id !== id)
    },

    async publish(id) {
      const result = await publishVehicle(id)
      this.current = result.vehicle
      const index = this.items.findIndex((item) => item.id === id)
      if (index >= 0) this.items[index] = result.vehicle
      return result
    },

    async unpublish(id) {
      const result = await unpublishVehicle(id)
      this.current = result.vehicle
      return result
    },
  },
})
