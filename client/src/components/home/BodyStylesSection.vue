<script setup>
import { computed } from 'vue'
import SectionHeading from '@/components/common/SectionHeading.vue'
import { uniqueValues } from '@/utils/vehicles'

const props = defineProps({
  vehicles: { type: Array, required: true },
})

const emit = defineEmits(['select'])

const icons = {
  SUV: 'bi-car-front-fill',
  Sedan: 'bi-car-front',
  Truck: 'bi-truck-front-fill',
  Coupe: 'bi-speedometer2',
  Wagon: 'bi-suitcase-lg',
}

const bodyStyles = computed(() =>
  uniqueValues(props.vehicles, 'bodyType')
    .map((type) => ({
      type,
      icon: icons[type] ?? 'bi-car-front',
      count: props.vehicles.filter((vehicle) => vehicle.bodyType === type).length,
    }))
    .sort((a, b) => b.count - a.count),
)
</script>

<template>
  <section id="body-styles" class="py-5">
    <div class="container">
      <SectionHeading
        eyebrow="Browse"
        title="Shop by body style"
        subtitle="Pick a style to see every matching vehicle in stock."
      />

      <div class="row row-cols-2 row-cols-md-3 row-cols-lg-5 g-3">
        <div v-for="style in bodyStyles" :key="style.type" class="col">
          <button
            type="button"
            class="card h-100 w-100 border-0 shadow-sm text-center body-style-tile"
            @click="emit('select', style.type)"
          >
            <span class="card-body w-100">
              <i :class="['bi', style.icon, 'fs-1 text-primary']"></i>
              <span class="d-block h6 fw-bold mt-2 mb-1">{{ style.type }}</span>
              <span class="badge rounded-pill text-bg-light border">
                {{ style.count }} {{ style.count === 1 ? 'vehicle' : 'vehicles' }}
              </span>
            </span>
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.body-style-tile {
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.body-style-tile:hover,
.body-style-tile:focus-visible {
  transform: translateY(-4px);
  box-shadow: var(--bs-box-shadow) !important;
}
</style>
