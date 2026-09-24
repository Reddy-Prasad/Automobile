import { computed, ref, watch } from 'vue'
import { dealer, locations } from '@/data/dealer'
import { getVehicle, patchVehicle } from '@/services/vehicleService'
import {
  relatedVehicles,
  vehicleFeatures,
  vehicleGallery,
  vehicleLocation,
  vehicleTitle,
} from '@/utils/vehicles'
import { useAsyncResource } from './useAsyncResource'

export function useVehicle(idSource) {
  const vehicle = ref(null)
  const similar = ref([])
  const { status, error, run } = useAsyncResource()

  const title = computed(() => (vehicle.value ? vehicleTitle(vehicle.value) : ''))
  const features = computed(() => (vehicle.value ? vehicleFeatures(vehicle.value) : []))
  const gallery = computed(() => (vehicle.value ? vehicleGallery(vehicle.value) : []))
  const location = computed(() =>
    vehicle.value ? vehicleLocation(vehicle.value, locations) : null,
  )

  async function load() {
    const id = typeof idSource === 'function' ? idSource() : idSource
    try {
      const result = await run(() => getVehicle(id))
      vehicle.value = result
      try {
        similar.value = relatedVehicles(await listSiblings(), result)
      } catch {
        similar.value = []
      }
    } catch {
      vehicle.value = null
      similar.value = []
    }
  }

  async function listSiblings() {
    const { listVehicles } = await import('@/services/vehicleService')
    return listVehicles()
  }

  async function saveVehicle(changes) {
    vehicle.value = await patchVehicle(vehicle.value.id, changes)
    return vehicle.value
  }

  watch(idSource, () => {
    load()
  }, { immediate: true })

  return {
    vehicle,
    similar,
    title,
    features,
    gallery,
    location,
    dealer,
    status,
    error,
    load,
    retry: load,
    saveVehicle,
  }
}
