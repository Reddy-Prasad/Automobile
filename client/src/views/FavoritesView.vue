<script setup>
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import SectionHeading from '@/components/common/SectionHeading.vue'
import VehicleCard from '@/components/vehicles/VehicleCard.vue'
import { useAuthStore } from '@/stores/authStore'
import { useFavoriteStore } from '@/stores/favoriteStore'
import { useVehicleStore } from '@/stores/vehicleStore'

const vehicleStore = useVehicleStore()
const favoriteStore = useFavoriteStore()
const authStore = useAuthStore()

const { vehicles, count } = storeToRefs(favoriteStore)
const { isSignedIn, displayName } = storeToRefs(authStore)

onMounted(() => {
  vehicleStore.loadVehicles().catch(() => {})
})
</script>

<template>
  <section class="bg-body-tertiary border-bottom py-5">
    <div class="container">
      <SectionHeading
        eyebrow="Saved vehicles"
        title="Favorites"
        :subtitle="
          isSignedIn
            ? `${displayName}, these hearts are shared across every page from favoriteStore.`
            : 'Hearts are shared across cards and details. They stay in this browser even if you are a guest.'
        "
      />
    </div>
  </section>

  <section class="py-5">
    <div class="container">
      <div v-if="count" class="row row-cols-1 row-cols-sm-2 row-cols-xl-3 g-4">
        <div v-for="vehicle in vehicles" :key="vehicle.id" class="col">
          <VehicleCard :vehicle="vehicle" />
        </div>
      </div>

      <div v-else class="text-center border rounded-3 bg-body-tertiary py-5 px-3">
        <i class="bi bi-heart display-4 text-body-secondary"></i>
        <h2 class="h4 mt-3">No favorites yet</h2>
        <p class="text-body-secondary mb-4">
          Tap the heart on a card or the Favorite button on a vehicle page.
        </p>
        <RouterLink class="btn btn-primary" :to="{ name: 'vehicles' }">Browse inventory</RouterLink>
      </div>
    </div>
  </section>
</template>
