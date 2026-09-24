import { defineStore } from 'pinia'
import { useVehicleStore } from './vehicleStore'

const STORAGE_KEY = 'autodrive.compare'
export const COMPARE_LIMIT = 3

function sameId(left, right) {
  return String(left) === String(right)
}

function readPersisted() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    const parsed = raw ? JSON.parse(raw) : { ids: [], snapshots: {} }
    if (Array.isArray(parsed)) {
      return { ids: parsed.map(String).slice(0, COMPARE_LIMIT), snapshots: {} }
    }
    return {
      ids: Array.isArray(parsed.ids) ? parsed.ids.map(String).slice(0, COMPARE_LIMIT) : [],
      snapshots: parsed.snapshots && typeof parsed.snapshots === 'object' ? parsed.snapshots : {},
    }
  } catch {
    return { ids: [], snapshots: {} }
  }
}

function persist(ids, snapshots) {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ ids, snapshots }))
}

const persisted = readPersisted()

export const useCompareStore = defineStore('compare', {
  state: () => ({
    ids: persisted.ids,
    snapshots: persisted.snapshots,
    message: '',
  }),

  getters: {
    count: (state) => state.ids.length,
    isFull: (state) => state.ids.length >= COMPARE_LIMIT,
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
      this.snapshots = { ...this.snapshots, [String(vehicle.id)]: vehicle }
    },

    add(vehicle) {
      const id = String(vehicle.id)
      this.message = ''
      if (this.has(id)) return true
      if (this.isFull) {
        this.message = `Compare holds ${COMPARE_LIMIT} vehicles. Remove one first.`
        return false
      }
      this.ids = [...this.ids, id]
      this.remember(vehicle)
      persist(this.ids, this.snapshots)
      this.message = 'Added to compare.'
      return true
    },

    remove(id) {
      const key = String(id)
      this.ids = this.ids.filter((savedId) => !sameId(savedId, key))
      const next = { ...this.snapshots }
      delete next[key]
      this.snapshots = next
      this.message = ''
      persist(this.ids, this.snapshots)
    },

    toggle(vehicle) {
      if (this.has(vehicle.id)) {
        this.remove(vehicle.id)
        return true
      }
      return this.add(vehicle)
    },

    clear() {
      this.ids = []
      this.snapshots = {}
      this.message = ''
      persist(this.ids, this.snapshots)
    },
  },
})
