<script setup>
import { computed, reactive, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import SectionHeading from '@/components/common/SectionHeading.vue'
import VehicleCard from '@/components/vehicles/VehicleCard.vue'
import { conditionLabels, vehicles } from '@/data/vehicles'
import { formatCurrency } from '@/utils/format'
import { filterInventory, paginate, sortInventory, uniqueValues } from '@/utils/vehicles'

const pageSize = 6
const route = useRoute()

const sortOptions = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-low', label: 'Price: low to high' },
  { value: 'price-high', label: 'Price: high to low' },
  { value: 'newest', label: 'Year: newest first' },
  { value: 'mileage', label: 'Mileage: low to high' },
]

const priceOptions = [20000, 30000, 40000, 50000]

function emptyFilters() {
  return {
    search: '',
    make: '',
    fuelType: '',
    transmission: '',
    maxPrice: '',
    year: '',
    condition: '',
  }
}

function filtersFromQuery(query) {
  const next = emptyFilters()
  const allowed = Object.keys(next)

  for (const key of allowed) {
    if (query[key]) next[key] = String(query[key])
  }

  return next
}

const filters = reactive(filtersFromQuery(route.query))
const sortBy = ref(typeof route.query.sort === 'string' ? route.query.sort : 'featured')
const currentPage = ref(1)

const makes = uniqueValues(vehicles, 'make')
const fuelTypes = uniqueValues(vehicles, 'fuelType')
const transmissions = uniqueValues(vehicles, 'transmission')
const years = uniqueValues(vehicles, 'year').sort((a, b) => b - a)

const filteredVehicles = computed(() => {
  const matches = filterInventory(vehicles, filters)
  return sortInventory(matches, sortBy.value)
})

const totalPages = computed(() => Math.max(1, Math.ceil(filteredVehicles.value.length / pageSize)))

const visibleVehicles = computed(() => paginate(filteredVehicles.value, currentPage.value, pageSize))

const pageNumbers = computed(() =>
  Array.from({ length: totalPages.value }, (_, index) => index + 1),
)

const currentSortLabel = computed(
  () => sortOptions.find((option) => option.value === sortBy.value)?.label ?? 'Featured',
)

const hasActiveFilters = computed(() => Object.values(filters).some((value) => value !== ''))

const resultRange = computed(() => {
  if (!filteredVehicles.value.length) return ''
  const start = (currentPage.value - 1) * pageSize + 1
  const end = start + visibleVehicles.value.length - 1
  return `${start}–${end}`
})

const hasElectricOnPage = computed(() =>
  visibleVehicles.value.some((vehicle) => vehicle.fuelType === 'Electric'),
)

const allOnPageAvailable = computed(
  () =>
    visibleVehicles.value.length > 0 &&
    visibleVehicles.value.every((vehicle) => vehicle.availability === 'AVAILABLE'),
)

watch(
  [filters, sortBy],
  () => {
    currentPage.value = 1
  },
  { deep: true },
)

function resetFilters() {
  Object.assign(filters, emptyFilters())
  sortBy.value = 'featured'
}
</script>

<template>
  <section class="bg-body-tertiary border-bottom py-5">
    <div class="container">
      <SectionHeading
        eyebrow="Vehicle inventory"
        title="Find your next vehicle"
        subtitle="Search, filter and sort 24 new, used and certified vehicles. No backend — this page reads local mock data."
      />

      <form class="card border-0 shadow-sm" @submit.prevent>
        <div class="card-body p-3 p-lg-4">
          <div class="row g-3">
            <div class="col-12 col-lg-6">
              <label for="inventory-search" class="form-label small fw-semibold">Search</label>
              <div class="input-group">
                <span class="input-group-text"><i class="bi bi-search"></i></span>
                <input
                  id="inventory-search"
                  v-model.trim="filters.search"
                  type="search"
                  class="form-control"
                  placeholder="Make, model, trim, body style or stock #"
                />
              </div>
            </div>

            <div class="col-6 col-md-4 col-lg-3">
              <label for="make-filter" class="form-label small fw-semibold">Make</label>
              <select id="make-filter" v-model="filters.make" class="form-select">
                <option value="">All makes</option>
                <option v-for="make in makes" :key="make" :value="make">{{ make }}</option>
              </select>
            </div>

            <div class="col-6 col-md-4 col-lg-3">
              <label for="fuel-filter" class="form-label small fw-semibold">Fuel</label>
              <select id="fuel-filter" v-model="filters.fuelType" class="form-select">
                <option value="">All fuel types</option>
                <option v-for="fuel in fuelTypes" :key="fuel" :value="fuel">{{ fuel }}</option>
              </select>
            </div>

            <div class="col-6 col-md-4 col-lg-3">
              <label for="transmission-filter" class="form-label small fw-semibold">
                Transmission
              </label>
              <select id="transmission-filter" v-model="filters.transmission" class="form-select">
                <option value="">All transmissions</option>
                <option v-for="item in transmissions" :key="item" :value="item">{{ item }}</option>
              </select>
            </div>

            <div class="col-6 col-md-4 col-lg-3">
              <label for="price-filter" class="form-label small fw-semibold">Max price</label>
              <select id="price-filter" v-model="filters.maxPrice" class="form-select">
                <option value="">No maximum</option>
                <option v-for="price in priceOptions" :key="price" :value="price">
                  {{ formatCurrency(price) }}
                </option>
              </select>
            </div>

            <div class="col-6 col-md-4 col-lg-3">
              <label for="year-filter" class="form-label small fw-semibold">Year</label>
              <select id="year-filter" v-model="filters.year" class="form-select">
                <option value="">All years</option>
                <option v-for="year in years" :key="year" :value="year">{{ year }}</option>
              </select>
            </div>

            <div class="col-6 col-md-4 col-lg-3">
              <label for="condition-filter" class="form-label small fw-semibold">Condition</label>
              <select id="condition-filter" v-model="filters.condition" class="form-select">
                <option value="">All conditions</option>
                <option v-for="(label, value) in conditionLabels" :key="value" :value="value">
                  {{ label }}
                </option>
              </select>
            </div>
          </div>
        </div>
      </form>
    </div>
  </section>

  <section class="py-5">
    <div class="container">
      <div class="d-flex flex-column flex-lg-row justify-content-between align-items-lg-center gap-3 mb-4">
        <div>
          <h2 class="h4 fw-bold mb-1">
            {{ filteredVehicles.length }}
            {{ filteredVehicles.length === 1 ? 'vehicle' : 'vehicles' }}
          </h2>
          <p class="text-body-secondary mb-0">
            <template v-if="filteredVehicles.length">
              Showing {{ resultRange }} · sorted by {{ currentSortLabel.toLowerCase() }}
            </template>
            <template v-else>No matches for the current filters</template>
          </p>
        </div>

        <div class="d-flex flex-wrap align-items-center gap-2">
          <button
            v-if="hasActiveFilters"
            type="button"
            class="btn btn-outline-secondary"
            @click="resetFilters"
          >
            <i class="bi bi-x-lg me-1"></i>Clear filters
          </button>
          <label for="inventory-sort" class="text-nowrap fw-semibold mb-0">Sort by</label>
          <select id="inventory-sort" v-model="sortBy" class="form-select inventory-sort">
            <option v-for="option in sortOptions" :key="option.value" :value="option.value">
              {{ option.label }}
            </option>
          </select>
        </div>
      </div>

      <div v-if="visibleVehicles.length" class="d-flex flex-wrap gap-2 mb-4">
        <span v-if="hasElectricOnPage" class="badge text-bg-success-subtle text-success-emphasis">
          <i class="bi bi-lightning-charge me-1"></i>EV option on this page
        </span>
        <span v-if="allOnPageAvailable" class="badge text-bg-primary-subtle text-primary-emphasis">
          Every vehicle on this page is available
        </span>
      </div>

      <div v-if="visibleVehicles.length" class="row row-cols-1 row-cols-sm-2 row-cols-xl-3 g-4">
        <div v-for="vehicle in visibleVehicles" :key="vehicle.id" class="col">
          <VehicleCard :vehicle="vehicle" />
        </div>
      </div>

      <div v-else class="text-center border rounded-3 bg-body-tertiary py-5 px-3">
        <i class="bi bi-search display-4 text-body-secondary"></i>
        <h2 class="h4 mt-3">No vehicles found</h2>
        <p class="text-body-secondary mb-4">
          Try a different search, or remove one of the filters.
        </p>
        <button type="button" class="btn btn-primary" @click="resetFilters">Clear filters</button>
      </div>

      <nav v-if="filteredVehicles.length > pageSize" class="mt-5" aria-label="Inventory pages">
        <ul class="pagination justify-content-center mb-0">
          <li class="page-item" :class="{ disabled: currentPage === 1 }">
            <button
              type="button"
              class="page-link"
              :disabled="currentPage === 1"
              @click="currentPage--"
            >
              Previous
            </button>
          </li>
          <li
            v-for="page in pageNumbers"
            :key="page"
            class="page-item"
            :class="{ active: currentPage === page }"
          >
            <button type="button" class="page-link" @click="currentPage = page">{{ page }}</button>
          </li>
          <li class="page-item" :class="{ disabled: currentPage === totalPages }">
            <button
              type="button"
              class="page-link"
              :disabled="currentPage === totalPages"
              @click="currentPage++"
            >
              Next
            </button>
          </li>
        </ul>
      </nav>
    </div>
  </section>
</template>

<style scoped>
.inventory-sort {
  min-width: 13rem;
}
</style>
