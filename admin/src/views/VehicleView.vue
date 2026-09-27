<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import StatusBadge from '@/components/StatusBadge.vue'
import { PERMISSIONS } from '@/data/roles'
import { useAuthStore } from '@/stores/authStore'
import { useVehicleStore } from '@/stores/vehicleStore'

const route = useRoute()
const authStore = useAuthStore()
const vehicleStore = useVehicleStore()
const message = ref('')

const vehicle = computed(() => vehicleStore.current)
const title = computed(() =>
  vehicle.value ? `${vehicle.value.year} ${vehicle.value.make} ${vehicle.value.model}` : '',
)

onMounted(() => vehicleStore.loadOne(route.params.id).catch(() => {}))

async function onPublish() {
  message.value = ''
  try {
    await vehicleStore.publish(Number(route.params.id))
    message.value = 'Published. Refresh the client inventory page to see it through vehicleService.'
  } catch (error) {
    message.value = error.message
  }
}

async function onUnpublish() {
  message.value = ''
  try {
    await vehicleStore.unpublish(Number(route.params.id))
    message.value = 'Unpublished. Client refresh will drop extras that are no longer in the snapshot.'
  } catch (error) {
    message.value = error.message
  }
}
</script>

<template>
  <div>
    <RouterLink class="small" :to="{ name: 'inventory' }">← Inventory</RouterLink>
    <div v-if="vehicleStore.status === 'error'" class="alert alert-danger mt-3">
      {{ vehicleStore.error?.message }}
    </div>
    <template v-else-if="vehicle">
      <div class="d-flex flex-wrap justify-content-between gap-3 mt-2 mb-4">
        <div>
          <h1 class="h3 fw-bold mb-1">{{ title }}</h1>
          <p class="mb-0">
            <StatusBadge :status="vehicle.listingStatus" />
            <StatusBadge class="ms-2" :status="vehicle.availability" />
            <span class="small text-body-secondary ms-2">{{ vehicle.stockNumber }}</span>
          </p>
        </div>
        <div class="d-flex flex-wrap gap-2">
          <RouterLink
            v-if="authStore.can(PERMISSIONS.INVENTORY_WRITE)"
            class="btn btn-outline-primary"
            :to="{ name: 'inventory-edit', params: { id: vehicle.id } }"
          >
            Edit
          </RouterLink>
          <button
            v-if="authStore.can(PERMISSIONS.INVENTORY_WRITE) && vehicle.listingStatus === 'draft'"
            type="button"
            class="btn btn-success"
            @click="onPublish"
          >
            Publish
          </button>
          <button
            v-if="authStore.can(PERMISSIONS.INVENTORY_WRITE) && vehicle.listingStatus === 'published'"
            type="button"
            class="btn btn-outline-warning"
            @click="onUnpublish"
          >
            Unpublish
          </button>
        </div>
      </div>

      <div v-if="message" class="alert alert-info">{{ message }}</div>

      <div class="row g-4">
        <div class="col-lg-5">
          <img
            :src="`http://localhost:5173${vehicle.image}`"
            :alt="title"
            class="img-fluid rounded shadow-sm"
          />
        </div>
        <div class="col-lg-7">
          <dl class="row mb-0">
            <dt class="col-sm-4">Price</dt>
            <dd class="col-sm-8">${{ Number(vehicle.price).toLocaleString() }}</dd>
            <dt class="col-sm-4">Condition</dt>
            <dd class="col-sm-8">{{ vehicle.condition }}</dd>
            <dt class="col-sm-4">Trim</dt>
            <dd class="col-sm-8">{{ vehicle.trim }}</dd>
            <dt class="col-sm-4">Body / fuel</dt>
            <dd class="col-sm-8">{{ vehicle.bodyType }} · {{ vehicle.fuelType }}</dd>
            <dt class="col-sm-4">Mileage</dt>
            <dd class="col-sm-8">{{ vehicle.mileage }}</dd>
            <dt class="col-sm-4">Color</dt>
            <dd class="col-sm-8">{{ vehicle.exteriorColor }}</dd>
          </dl>
        </div>
      </div>
    </template>
  </div>
</template>
