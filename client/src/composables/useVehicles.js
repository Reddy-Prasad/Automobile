import { ref } from 'vue'
import { failNextRequest } from '@/api/http'
import { listVehicles } from '@/services/vehicleService'
import { useAsyncResource } from './useAsyncResource'

export function useVehicles() {
  const vehicles = ref([])
  const { status, error, run } = useAsyncResource()

  async function load(params) {
    try {
      vehicles.value = await run(() => listVehicles(params))
    } catch {
      vehicles.value = []
    }
    return vehicles.value
  }

  function simulateError() {
    failNextRequest()
    return load()
  }

  return { vehicles, status, error, load, retry: load, simulateError }
}
