<script setup>
import { computed, nextTick, onMounted, ref, useTemplateRef } from 'vue'
import ResourceState from '@/components/common/ResourceState.vue'
import { useVehicles } from '@/composables/useVehicles'
import { filterVehicles } from '@/utils/vehicles'
import { formatCurrency } from '@/utils/format'

import HeroCarousel from '@/components/home/HeroCarousel.vue'
import VehicleSearch from '@/components/home/VehicleSearch.vue'
import VehicleShowcase from '@/components/home/VehicleShowcase.vue'
import BodyStylesSection from '@/components/home/BodyStylesSection.vue'
import OffersSection from '@/components/home/OffersSection.vue'
import FinanceSection from '@/components/home/FinanceSection.vue'
import ServiceSection from '@/components/home/ServiceSection.vue'
import TradeInSection from '@/components/home/TradeInSection.vue'
import LocationsSection from '@/components/home/LocationsSection.vue'
import CtaSection from '@/components/home/CtaSection.vue'

const { vehicles, status, error, load, retry } = useVehicles()

const featuredVehicles = computed(() =>
  vehicles.value.filter((vehicle) => vehicle.featured).slice(0, 4),
)
const newVehicles = computed(() =>
  vehicles.value.filter((vehicle) => vehicle.condition === 'new').slice(0, 4),
)
const usedVehicles = computed(() =>
  vehicles.value.filter((vehicle) => vehicle.condition !== 'new').slice(0, 4),
)

const vehicleSearch = useTemplateRef('vehicleSearch')
const searchCriteria = ref(null)
const searchResults = computed(() =>
  searchCriteria.value ? filterVehicles(vehicles.value, searchCriteria.value) : [],
)

const conditionSummary = { all: 'Any condition', new: 'New', used: 'Used & CPO' }

const searchSummary = computed(() => {
  if (!searchCriteria.value) return ''
  const { condition, make, bodyType, maxPrice } = searchCriteria.value
  return [
    conditionSummary[condition],
    make,
    bodyType,
    maxPrice && `Under ${formatCurrency(maxPrice)}`,
  ]
    .filter(Boolean)
    .join(' · ')
})

async function onSearch(criteria) {
  searchCriteria.value = criteria
  await nextTick()
  document.getElementById('search-results')?.scrollIntoView({ behavior: 'smooth' })
}

function onBodyStyleSelect(bodyType) {
  vehicleSearch.value.searchBy({ bodyType })
}

function clearSearch() {
  searchCriteria.value = null
  vehicleSearch.value.reset()
}

onMounted(() => {
  load()
})
</script>

<template>
  <h1 class="visually-hidden">AutoDrive — new, used and certified vehicles in Texas</h1>

  <HeroCarousel />
  <ResourceState :status="status" :error="error" @retry="retry">
  <VehicleSearch ref="vehicleSearch" :vehicles="vehicles" @search="onSearch" />

  <VehicleShowcase
    v-if="searchCriteria"
    id="search-results"
    eyebrow="Search results"
    title="Vehicles that match"
    :subtitle="searchSummary"
    :vehicles="searchResults"
  >
    <template #actions>
      <button type="button" class="btn btn-outline-secondary btn-sm" @click="clearSearch">
        <i class="bi bi-x-lg me-1"></i>Clear search
      </button>
    </template>
  </VehicleShowcase>

  <VehicleShowcase
    id="featured"
    eyebrow="Hand-picked"
    title="Featured vehicles"
    subtitle="Popular picks our customers are test-driving this week."
    :vehicles="featuredVehicles"
  >
    <template #actions>
      <RouterLink class="btn btn-outline-primary btn-sm" :to="{ name: 'vehicles' }">
        Browse all inventory
      </RouterLink>
    </template>
  </VehicleShowcase>
  <BodyStylesSection :vehicles="vehicles" @select="onBodyStyleSelect" />
  <VehicleShowcase
    id="new-vehicles"
    eyebrow="Just arrived"
    title="New vehicles"
    subtitle="2026 models with full factory warranty."
    :vehicles="newVehicles"
    muted
  >
    <template #actions>
      <RouterLink
        class="btn btn-outline-primary btn-sm"
        :to="{ name: 'vehicles', query: { condition: 'new' } }"
      >
        Shop new vehicles
      </RouterLink>
    </template>
  </VehicleShowcase>
  <VehicleShowcase
    id="used-vehicles"
    eyebrow="Pre-owned"
    title="Used & certified vehicles"
    subtitle="Every vehicle inspected, with a free vehicle history report."
    :vehicles="usedVehicles"
  >
    <template #actions>
      <RouterLink
        class="btn btn-outline-primary btn-sm"
        :to="{ name: 'vehicles', query: { condition: 'used' } }"
      >
        Shop used vehicles
      </RouterLink>
    </template>
  </VehicleShowcase>
  </ResourceState>

  <OffersSection />
  <FinanceSection />
  <ServiceSection />
  <TradeInSection />
  <LocationsSection />
  <CtaSection />
</template>
