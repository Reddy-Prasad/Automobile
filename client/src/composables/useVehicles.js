import { storeToRefs } from 'pinia'
import { useVehicleStore } from '@/stores/vehicleStore'

/** Thin wrapper so older screens can still call load/retry. Prefer the store. */
export function useVehicles() {
  const store = useVehicleStore()
  const { items, listStatus, listError } = storeToRefs(store)

  return {
    vehicles: items,
    status: listStatus,
    error: listError,
    load: () => store.loadVehicles(),
    retry: () => store.loadVehicles({ force: true }),
    simulateError: () => store.simulateError(),
  }
}
