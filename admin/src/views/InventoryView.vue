<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { storeToRefs } from 'pinia'
import DataTable from '@/components/DataTable.vue'
import EmptyState from '@/components/EmptyState.vue'
import Modal from '@/components/Modal.vue'
import StatusBadge from '@/components/StatusBadge.vue'
import { PERMISSIONS } from '@/data/roles'
import { useAuthStore } from '@/stores/authStore'
import { useVehicleStore } from '@/stores/vehicleStore'

const PAGE_SIZE = 8
const authStore = useAuthStore()
const vehicleStore = useVehicleStore()
const { items, status, error } = storeToRefs(vehicleStore)

const filters = reactive({ search: '', condition: '', listingStatus: '', availability: '' })
const page = ref(1)
const pendingDelete = ref(null)
const message = ref('')

const columns = [
  { key: 'stockNumber', label: 'Stock' },
  { key: 'title', label: 'Vehicle' },
  { key: 'condition', label: 'Condition' },
  { key: 'price', label: 'Price' },
  { key: 'availability', label: 'Lot status' },
  { key: 'listingStatus', label: 'Listing' },
]

const filtered = computed(() => {
  const term = filters.search.trim().toLowerCase()
  return items.value.filter((vehicle) => {
    const hay = `${vehicle.year} ${vehicle.make} ${vehicle.model} ${vehicle.stockNumber}`.toLowerCase()
    if (term && !hay.includes(term)) return false
    if (filters.condition && vehicle.condition !== filters.condition) return false
    if (filters.listingStatus && vehicle.listingStatus !== filters.listingStatus) return false
    if (filters.availability && vehicle.availability !== filters.availability) return false
    return true
  })
})

const pageCount = computed(() => Math.max(1, Math.ceil(filtered.value.length / PAGE_SIZE)))
const rows = computed(() => {
  const start = (page.value - 1) * PAGE_SIZE
  return filtered.value.slice(start, start + PAGE_SIZE).map((vehicle) => ({
    ...vehicle,
    title: `${vehicle.year} ${vehicle.make} ${vehicle.model}`,
  }))
})

onMounted(() => vehicleStore.loadList().catch(() => {}))

function resetPage() {
  page.value = 1
}

async function onPublish(row) {
  message.value = ''
  try {
    await vehicleStore.publish(row.id)
    message.value = `${row.title} is on the client lot. Refresh http://localhost:5173/vehicles.`
  } catch (err) {
    message.value = err.message
  }
}

async function confirmDelete() {
  if (!pendingDelete.value) return
  try {
    await vehicleStore.remove(pendingDelete.value.id)
    pendingDelete.value = null
  } catch (err) {
    message.value = err.message
    pendingDelete.value = null
  }
}
</script>

<template>
  <div>
    <div class="d-flex flex-wrap justify-content-between gap-3 mb-4">
      <div>
        <p class="small text-uppercase text-primary fw-semibold mb-1">Lot</p>
        <h1 class="h3 fw-bold mb-0">Inventory</h1>
      </div>
      <RouterLink
        v-if="authStore.can(PERMISSIONS.INVENTORY_WRITE)"
        class="btn btn-primary"
        :to="{ name: 'inventory-new' }"
      >
        Create vehicle
      </RouterLink>
    </div>

    <div v-if="message" class="alert alert-info">{{ message }}</div>

    <div class="card border-0 shadow-sm mb-3">
      <div class="card-body row g-2">
        <div class="col-md-4">
          <input
            v-model="filters.search"
            class="form-control"
            placeholder="Search stock, make, model"
            @input="resetPage"
          />
        </div>
        <div class="col-md-2">
          <select v-model="filters.condition" class="form-select" @change="resetPage">
            <option value="">Condition</option>
            <option value="new">New</option>
            <option value="used">Used</option>
            <option value="cpo">CPO</option>
          </select>
        </div>
        <div class="col-md-3">
          <select v-model="filters.listingStatus" class="form-select" @change="resetPage">
            <option value="">Listing</option>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>
        <div class="col-md-3">
          <select v-model="filters.availability" class="form-select" @change="resetPage">
            <option value="">Availability</option>
            <option value="AVAILABLE">Available</option>
            <option value="IN_TRANSIT">In transit</option>
            <option value="RESERVED">Reserved</option>
          </select>
        </div>
      </div>
    </div>

    <div v-if="status === 'loading'" class="alert alert-secondary">Loading inventory…</div>
    <div v-else-if="status === 'error'" class="alert alert-danger">
      {{ error?.message }}
      <button type="button" class="btn btn-sm btn-outline-danger ms-2" @click="vehicleStore.loadList()">
        Retry
      </button>
    </div>
    <EmptyState v-else-if="!filtered.length" title="No vehicles match" text="Clear a filter or create a draft." />
    <div v-else class="card border-0 shadow-sm">
      <DataTable :columns="columns" :rows="rows">
        <template #price="{ value }">${{ Number(value).toLocaleString() }}</template>
        <template #availability="{ value }">
          <StatusBadge :status="value" />
        </template>
        <template #listingStatus="{ value }">
          <StatusBadge :status="value" />
        </template>
        <template #actions="{ row }">
          <RouterLink class="btn btn-sm btn-outline-secondary me-1" :to="{ name: 'inventory-view', params: { id: row.id } }">
            View
          </RouterLink>
          <RouterLink
            v-if="authStore.can(PERMISSIONS.INVENTORY_WRITE)"
            class="btn btn-sm btn-outline-primary me-1"
            :to="{ name: 'inventory-edit', params: { id: row.id } }"
          >
            Edit
          </RouterLink>
          <button
            v-if="authStore.can(PERMISSIONS.INVENTORY_WRITE) && row.listingStatus === 'draft'"
            type="button"
            class="btn btn-sm btn-success me-1"
            @click="onPublish(row)"
          >
            Publish
          </button>
          <button
            v-if="authStore.can(PERMISSIONS.INVENTORY_WRITE) && row.listingStatus !== 'published'"
            type="button"
            class="btn btn-sm btn-outline-danger"
            @click="pendingDelete = row"
          >
            Delete
          </button>
        </template>
      </DataTable>
      <div v-if="pageCount > 1" class="d-flex justify-content-between align-items-center px-3 py-2 border-top">
        <span class="small text-body-secondary">{{ filtered.length }} vehicles</span>
        <div class="btn-group btn-group-sm">
          <button type="button" class="btn btn-outline-secondary" :disabled="page === 1" @click="page -= 1">
            Prev
          </button>
          <button type="button" class="btn btn-outline-secondary" disabled>{{ page }} / {{ pageCount }}</button>
          <button
            type="button"
            class="btn btn-outline-secondary"
            :disabled="page === pageCount"
            @click="page += 1"
          >
            Next
          </button>
        </div>
      </div>
    </div>

    <Modal :open="Boolean(pendingDelete)" title="Delete draft?" @close="pendingDelete = null" @confirm="confirmDelete">
      Remove {{ pendingDelete?.title }} from the admin mock. Published units must be unpublished first.
    </Modal>
  </div>
</template>
