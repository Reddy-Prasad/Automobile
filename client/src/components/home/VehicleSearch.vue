<script setup>
import { computed, reactive } from 'vue'
import { filterVehicles, uniqueValues } from '@/utils/vehicles'
import { formatCurrency } from '@/utils/format'

const props = defineProps({
  vehicles: { type: Array, required: true },
})

const emit = defineEmits(['search'])

const conditionOptions = [
  { value: 'all', label: 'All' },
  { value: 'new', label: 'New' },
  { value: 'used', label: 'Used & CPO' },
]

const priceOptions = [25000, 35000, 45000, 55000]

function emptyFilters() {
  return {
    condition: 'all',
    make: '',
    bodyType: '',
    maxPrice: '',
  }
}

const filters = reactive(emptyFilters())

const makes = computed(() => uniqueValues(props.vehicles, 'make'))
const bodyTypes = computed(() => uniqueValues(props.vehicles, 'bodyType'))
const matchCount = computed(() => filterVehicles(props.vehicles, filters).length)

function onSubmit() {
  emit('search', { ...filters })
}

function searchBy(criteria) {
  Object.assign(filters, emptyFilters(), criteria)
  onSubmit()
}

function reset() {
  Object.assign(filters, emptyFilters())
}

defineExpose({ searchBy, reset })
</script>

<template>
  <section class="bg-body-tertiary py-4 border-bottom">
    <div class="container">
      <form class="card border-0 shadow-sm" @submit.prevent="onSubmit">
        <div class="card-body p-3 p-lg-4">
          <h2 class="h5 fw-bold mb-3">
            <i class="bi bi-search me-2 text-primary"></i>Search our inventory
          </h2>

          <div class="row g-3 align-items-end">
            <div class="col-12 col-lg-3">
              <span class="form-label d-block small fw-semibold">Condition</span>
              <div class="btn-group w-100" role="group" aria-label="Vehicle condition">
                <template v-for="option in conditionOptions" :key="option.value">
                  <input
                    :id="`search-condition-${option.value}`"
                    v-model="filters.condition"
                    type="radio"
                    class="btn-check"
                    name="condition"
                    :value="option.value"
                  />
                  <label
                    class="btn btn-outline-primary btn-sm"
                    :for="`search-condition-${option.value}`"
                  >
                    {{ option.label }}
                  </label>
                </template>
              </div>
            </div>

            <div class="col-6 col-md-3 col-lg-2">
              <label for="search-make" class="form-label small fw-semibold">Make</label>
              <select id="search-make" v-model="filters.make" class="form-select">
                <option value="">Any make</option>
                <option v-for="make in makes" :key="make" :value="make">{{ make }}</option>
              </select>
            </div>

            <div class="col-6 col-md-3 col-lg-2">
              <label for="search-body" class="form-label small fw-semibold">Body style</label>
              <select id="search-body" v-model="filters.bodyType" class="form-select">
                <option value="">Any style</option>
                <option v-for="type in bodyTypes" :key="type" :value="type">{{ type }}</option>
              </select>
            </div>

            <div class="col-6 col-md-3 col-lg-2">
              <label for="search-price" class="form-label small fw-semibold">Max price</label>
              <select id="search-price" v-model="filters.maxPrice" class="form-select">
                <option value="">No max</option>
                <option v-for="price in priceOptions" :key="price" :value="price">
                  {{ formatCurrency(price) }}
                </option>
              </select>
            </div>

            <div class="col-6 col-md-3 col-lg-3">
              <button type="submit" class="btn btn-primary w-100" :disabled="matchCount === 0">
                Show {{ matchCount }} {{ matchCount === 1 ? 'vehicle' : 'vehicles' }}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  </section>
</template>
