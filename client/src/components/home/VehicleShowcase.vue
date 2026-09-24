<script setup>
import SectionHeading from '@/components/common/SectionHeading.vue'
import VehicleCard from '@/components/vehicles/VehicleCard.vue'

defineProps({
  id: { type: String, required: true },
  eyebrow: { type: String, default: '' },
  title: { type: String, required: true },
  subtitle: { type: String, default: '' },
  vehicles: { type: Array, required: true },
  muted: { type: Boolean, default: false },
})
</script>

<template>
  <section :id="id" class="py-5" :class="{ 'bg-body-tertiary': muted }">
    <div class="container">
      <SectionHeading :eyebrow="eyebrow" :title="title" :subtitle="subtitle">
        <template #actions>
          <slot name="actions">
            <span class="badge rounded-pill text-bg-light border">
              {{ vehicles.length }} {{ vehicles.length === 1 ? 'vehicle' : 'vehicles' }}
            </span>
          </slot>
        </template>
      </SectionHeading>

      <div v-if="vehicles.length" class="row g-4">
        <div
          v-for="vehicle in vehicles"
          :key="vehicle.id"
          class="col-12 col-sm-6 col-lg-4 col-xl-3"
        >
          <VehicleCard :vehicle="vehicle" />
        </div>
      </div>

      <div v-else class="alert alert-light border text-center mb-0">
        <i class="bi bi-search me-2"></i>No vehicles match those filters. Try widening your search.
      </div>
    </div>
  </section>
</template>
