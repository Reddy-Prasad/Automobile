<script setup>
import { computed, ref } from 'vue'
import { conditionLabels } from '@/data/vehicles'
import { formatCurrency, formatMileage } from '@/utils/format'
import { vehicleTitle } from '@/utils/vehicles'

const props = defineProps({
  vehicle: { type: Object, required: true },
})

const isFavorite = ref(false)

const title = computed(() => vehicleTitle(props.vehicle))

const savings = computed(() => {
  const { msrp, price } = props.vehicle
  return msrp ? msrp - price : 0
})

const conditionBadgeClass = computed(() => {
  const classes = {
    new: 'text-bg-primary',
    used: 'text-bg-dark',
    cpo: 'text-bg-success',
  }
  return classes[props.vehicle.condition]
})

const placeholderIcon = computed(() => {
  if (props.vehicle.fuelType === 'Electric') return 'bi-ev-front-fill'
  if (props.vehicle.bodyType === 'Truck') return 'bi-truck-front-fill'
  return 'bi-car-front-fill'
})

const efficiencyIcon = computed(() =>
  props.vehicle.fuelType === 'Electric' ? 'bi-lightning-charge' : 'bi-fuel-pump',
)
</script>

<template>
  <article class="card h-100 border-0 shadow-sm vehicle-card">
    <div class="position-relative">
      <img
        v-if="vehicle.image"
        :src="vehicle.image"
        :alt="title"
        class="card-img-top vehicle-media object-fit-cover"
      />
      <div
        v-else
        class="card-img-top vehicle-media vehicle-placeholder d-flex align-items-center justify-content-center"
        :style="{ backgroundColor: vehicle.colorHex }"
        role="img"
        :aria-label="`${title} in ${vehicle.exteriorColor}`"
      >
        <i :class="['bi', placeholderIcon]"></i>
      </div>

      <span class="badge position-absolute top-0 start-0 m-3" :class="conditionBadgeClass">
        {{ conditionLabels[vehicle.condition] }}
      </span>

      <button
        type="button"
        class="btn btn-light btn-sm rounded-circle position-absolute top-0 end-0 m-2 favorite-btn"
        :aria-pressed="isFavorite"
        :aria-label="isFavorite ? 'Remove from favorites' : 'Save to favorites'"
        @click="isFavorite = !isFavorite"
      >
        <i class="bi" :class="isFavorite ? 'bi-heart-fill text-danger' : 'bi-heart'"></i>
      </button>
    </div>

    <div class="card-body d-flex flex-column">
      <h3 class="h6 fw-bold mb-0">{{ title }}</h3>
      <p class="small text-body-secondary mb-3">{{ vehicle.trim }}</p>

      <div class="d-flex align-items-baseline flex-wrap gap-2">
        <span class="fs-5 fw-bold">{{ formatCurrency(vehicle.price) }}</span>
        <span v-if="savings > 0" class="small text-body-secondary text-decoration-line-through">
          MSRP {{ formatCurrency(vehicle.msrp) }}
        </span>
      </div>
      <span
        v-if="savings > 0"
        class="badge bg-success-subtle text-success-emphasis align-self-start mt-1"
      >
        Save {{ formatCurrency(savings) }}
      </span>

      <ul class="list-unstyled small text-body-secondary d-flex flex-wrap gap-3 my-3">
        <li><i class="bi bi-speedometer2 me-1"></i>{{ formatMileage(vehicle.mileage) }}</li>
        <li><i class="bi bi-gear me-1"></i>{{ vehicle.drivetrain }}</li>
        <li><i class="bi me-1" :class="efficiencyIcon"></i>{{ vehicle.efficiency }}</li>
      </ul>

      <div class="mt-auto d-flex justify-content-between align-items-center gap-2">
        <span class="small text-body-secondary">Stock #{{ vehicle.stockNumber }}</span>
        <button type="button" class="btn btn-outline-primary btn-sm">View details</button>
      </div>
    </div>
  </article>
</template>

<style scoped>
.vehicle-card {
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.vehicle-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--bs-box-shadow) !important;
}

.vehicle-media {
  aspect-ratio: 16 / 10;
}

.vehicle-placeholder {
  background-image: linear-gradient(135deg, rgb(255 255 255 / 0.18), rgb(0 0 0 / 0.35));
  color: rgb(255 255 255 / 0.85);
  font-size: 4.5rem;
}

.favorite-btn {
  width: 2.25rem;
  height: 2.25rem;
}
</style>
