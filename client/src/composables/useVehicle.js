import { computed, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { dealer, locations } from '@/data/dealer'
import { useVehicleStore } from '@/stores/vehicleStore'
import {
  relatedVehicles,
  vehicleFeatures,
  vehicleGallery,
  vehicleLocation,
  vehicleTitle,
} from '@/utils/vehicles'

export function useVehicle(idSource) {
  const store = useVehicleStore()
  const { current, detailStatus, detailError, items } = storeToRefs(store)

  const title = computed(() => (current.value ? vehicleTitle(current.value) : ''))
  const features = computed(() => (current.value ? vehicleFeatures(current.value) : []))
  const gallery = computed(() => (current.value ? vehicleGallery(current.value) : []))
  const location = computed(() =>
    current.value ? vehicleLocation(current.value, locations) : null,
  )
  const similar = computed(() =>
    current.value ? relatedVehicles(items.value, current.value) : [],
  )

  watch(
    idSource,
    (id) => {
      store.loadVehicle(id).catch(() => {})
    },
    { immediate: true },
  )

  return {
    vehicle: current,
    similar,
    title,
    features,
    gallery,
    location,
    dealer,
    status: detailStatus,
    error: detailError,
    retry: () =>
      store.loadVehicle(typeof idSource === 'function' ? idSource() : idSource).catch(() => {}),
  }
}
