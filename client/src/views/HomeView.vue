<script setup>
import { computed, nextTick, ref } from 'vue'
import { vehicles } from '@/data/vehicles'
import { filterVehicles } from '@/utils/vehicles'

import HeroCarousel from '@/components/home/HeroCarousel.vue'
import VehicleSearch from '@/components/home/VehicleSearch.vue'
import VehicleShowcase from '@/components/home/VehicleShowcase.vue'
import OffersSection from '@/components/home/OffersSection.vue'
import FinanceSection from '@/components/home/FinanceSection.vue'
import ServiceSection from '@/components/home/ServiceSection.vue'
import TradeInSection from '@/components/home/TradeInSection.vue'
import LocationsSection from '@/components/home/LocationsSection.vue'
import CtaSection from '@/components/home/CtaSection.vue'

const featuredVehicles = computed(() => vehicles.filter((vehicle) => vehicle.featured))
const newVehicles = computed(() => vehicles.filter((vehicle) => vehicle.condition === 'new').slice(0, 4))
const usedVehicles = computed(() => vehicles.filter((vehicle) => vehicle.condition !== 'new').slice(0, 4))

const searchCriteria = ref(null)
const searchResults = computed(() =>
  searchCriteria.value ? filterVehicles(vehicles, searchCriteria.value) : [],
)

async function onSearch(criteria) {
  searchCriteria.value = criteria
  await nextTick()
  document.getElementById('search-results')?.scrollIntoView({ behavior: 'smooth' })
}

function clearSearch() {
  searchCriteria.value = null
}
</script>

<template>
  <h1 class="visually-hidden">AutoDrive — new, used and certified vehicles in Texas</h1>

  <HeroCarousel />
  <VehicleSearch :vehicles="vehicles" @search="onSearch" />

  <VehicleShowcase
    v-if="searchCriteria"
    id="search-results"
    eyebrow="Search results"
    title="Vehicles that match"
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
  />
  <VehicleShowcase
    id="new-vehicles"
    eyebrow="Just arrived"
    title="New vehicles"
    subtitle="2026 models with full factory warranty."
    :vehicles="newVehicles"
    muted
  />
  <VehicleShowcase
    id="used-vehicles"
    eyebrow="Pre-owned"
    title="Used & certified vehicles"
    subtitle="Every vehicle inspected, with a free vehicle history report."
    :vehicles="usedVehicles"
  />

  <OffersSection />
  <FinanceSection />
  <ServiceSection />
  <TradeInSection />
  <LocationsSection />
  <CtaSection />
</template>
