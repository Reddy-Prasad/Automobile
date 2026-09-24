import { defineStore } from 'pinia'
import { useVehicleStore } from './vehicleStore'

const STORAGE_KEY = 'autodrive.favorites'

function sameId(left, right) {
  return String(left) === String(right)
}

function readPersisted() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const parsed = raw ? JSON.parse(raw) : { ids: [], snapshots: {} }
    if (Array.isArray(parsed)) {
      return { ids: parsed.map(String), snapshots: {} }
    }
    return {
      ids: Array.isArray(parsed.ids) ? parsed.ids.map(String) : [],
      snapshots: parsed.snapshots && typeof parsed.snapshots === 'object' ? parsed.snapshots : {},
    }
  } catch {
    return { ids: [], snapshots: {} }
  }
}

function persist(ids, snapshots) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ ids, snapshots }))
}

function snapshotOf(vehicle) {
  return {
    id: vehicle.id,
    year: vehicle.year,
    make: vehicle.make,
    model: vehicle.model,
    trim: vehicle.trim,
    price: vehicle.price,
    image: vehicle.image,
    colorHex: vehicle.colorHex,
    exteriorColor: vehicle.exteriorColor,
    mileage: vehicle.mileage,
    transmission: vehicle.transmission,
    fuelType: vehicle.fuelType,
    efficiency: vehicle.efficiency,
    condition: vehicle.condition,
    availability: vehicle.availability,
    stockNumber: vehicle.stockNumber,
    msrp: vehicle.msrp,
    featured: vehicle.featured,
    bodyType: vehicle.bodyType,
  }
}

const persisted = readPersisted()

export const useFavoriteStore = defineStore('favorites', {
  state: () => ({
    ids: persisted.ids,
    snapshots: persisted.snapshots,
  }),

  getters: {
    count: (state) => state.ids.length,
    has: (state) => (id) => state.ids.some((savedId) => sameId(savedId, id)),
    vehicles: (state) => {
      const vehicleStore = useVehicleStore()
      return state.ids
        .map((id) => vehicleStore.byId(id) || state.snapshots[id] || null)
        .filter(Boolean)
    },
  },

  actions: {
    remember(vehicle) {
      if (!vehicle) return
      this.snapshots = { ...this.snapshots, [String(vehicle.id)]: snapshotOf(vehicle) }
    },

    async add(vehicle) {
      const id = String(vehicle.id)
      if (this.has(id)) return
      this.ids = [...this.ids, id]
      this.remember(vehicle)
      persist(this.ids, this.snapshots)
      await this.syncSaved(id, true)
    },

    async remove(id) {
      const key = String(id)
      if (!this.has(key)) return
      this.ids = this.ids.filter((savedId) => !sameId(savedId, key))
      const next = { ...this.snapshots }
      delete next[key]
      this.snapshots = next
      persist(this.ids, this.snapshots)
      await this.syncSaved(key, false)
    },

    async toggle(vehicle) {
      if (this.has(vehicle.id)) await this.remove(vehicle.id)
      else await this.add(vehicle)
    },

    async syncSaved(id, saved) {
      const vehicleStore = useVehicleStore()
      try {
        await vehicleStore.saveVehicle(id, { saved })
      } catch {
        // Local list stays. The mock PATCH is practice, not the source of truth.
      }
    },
  },
})
