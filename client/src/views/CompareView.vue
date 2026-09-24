<script setup>
import { computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import SectionHeading from '@/components/common/SectionHeading.vue'
import { useCompareStore } from '@/stores/compareStore'
import { useVehicleStore } from '@/stores/vehicleStore'
import { formatCurrency, formatMileage } from '@/utils/format'
import { vehicleTitle } from '@/utils/vehicles'

const vehicleStore = useVehicleStore()
const compareStore = useCompareStore()

const { vehicles, count, message } = storeToRefs(compareStore)

const rows = [
  { key: 'price', label: 'Price', format: (vehicle) => formatCurrency(vehicle.price) },
  { key: 'year', label: 'Year' },
  { key: 'mileage', label: 'Mileage', format: (vehicle) => formatMileage(vehicle.mileage) },
  { key: 'fuelType', label: 'Fuel' },
  { key: 'transmission', label: 'Transmission' },
  { key: 'bodyType', label: 'Body' },
  { key: 'condition', label: 'Condition' },
  { key: 'stockNumber', label: 'Stock #' },
]

const canCompare = computed(() => count.value >= 2)

onMounted(() => {
  vehicleStore.loadVehicles().catch(() => {})
})
</script>

<template>
  <section class="bg-body-tertiary border-bottom py-5">
    <div class="container">
      <SectionHeading
        eyebrow="Compare"
        title="Side by side"
        subtitle="compareStore holds up to 3 vehicles. This list is shared from every card and details page."
      />
      <p v-if="message" class="text-danger mb-0">{{ message }}</p>
    </div>
  </section>

  <section class="py-5">
    <div class="container">
      <div v-if="count" class="table-responsive">
        <table class="table align-middle">
          <thead>
            <tr>
              <th scope="col" class="w-25">Spec</th>
              <th v-for="vehicle in vehicles" :key="vehicle.id" scope="col">
                <div class="d-flex flex-column gap-2">
                  <RouterLink
                    class="fw-semibold text-decoration-none"
                    :to="{ name: 'vehicle-details', params: { id: String(vehicle.id) } }"
                  >
                    {{ vehicleTitle(vehicle) }}
                  </RouterLink>
                  <button
                    type="button"
                    class="btn btn-outline-secondary btn-sm align-self-start"
                    @click="compareStore.remove(vehicle.id)"
                  >
                    Remove
                  </button>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in rows" :key="row.key">
              <th scope="row">{{ row.label }}</th>
              <td v-for="vehicle in vehicles" :key="`${vehicle.id}-${row.key}`">
                {{ row.format ? row.format(vehicle) : vehicle[row.key] }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <p v-if="count === 1" class="text-body-secondary">
        Add one more vehicle to compare. Inventory cards have a compare button.
      </p>

      <div v-if="!count" class="text-center border rounded-3 bg-body-tertiary py-5 px-3">
        <i class="bi bi-plus-slash-minus display-4 text-body-secondary"></i>
        <h2 class="h4 mt-3">Nothing to compare</h2>
        <p class="text-body-secondary mb-4">Add up to three vehicles from inventory or a details page.</p>
        <RouterLink class="btn btn-primary" :to="{ name: 'vehicles' }">Browse inventory</RouterLink>
      </div>

      <div v-if="canCompare" class="mt-3">
        <button type="button" class="btn btn-outline-secondary" @click="compareStore.clear()">
          Clear compare
        </button>
      </div>
    </div>
  </section>
</template>
