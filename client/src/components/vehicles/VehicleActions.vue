<script setup>
defineProps({
  isFavorite: { type: Boolean, default: false },
  isCompared: { type: Boolean, default: false },
  testDriveDisabled: { type: Boolean, default: false },
})

const emit = defineEmits(['favorite', 'compare', 'finance', 'testdrive', 'tradein'])
</script>

<template>
  <div class="d-grid gap-2">
    <button type="button" class="btn btn-primary btn-lg" @click="emit('testdrive')" :disabled="testDriveDisabled">
      <i class="bi bi-calendar-check me-2"></i>Schedule a test drive
    </button>
    <button type="button" class="btn btn-outline-primary" @click="emit('finance')">
      <i class="bi bi-calculator me-2"></i>Estimate payment
    </button>
    <button type="button" class="btn btn-outline-secondary" @click="emit('tradein')">
      <i class="bi bi-arrow-left-right me-2"></i>Value my trade-in
    </button>
    <div class="d-flex gap-2">
      <button
        type="button"
        class="btn btn-outline-secondary flex-fill"
        :class="{ 'btn-secondary text-white': isFavorite }"
        :aria-pressed="isFavorite"
        @click="emit('favorite')"
      >
        <i class="bi me-1" :class="isFavorite ? 'bi-heart-fill' : 'bi-heart'"></i>
        {{ isFavorite ? 'Saved' : 'Favorite' }}
      </button>
      <button
        type="button"
        class="btn btn-outline-secondary flex-fill"
        :class="{ 'btn-secondary text-white': isCompared }"
        :aria-pressed="isCompared"
        @click="emit('compare')"
      >
        <i class="bi bi-plus-slash-minus me-1"></i>
        {{ isCompared ? 'In compare' : 'Compare' }}
      </button>
    </div>
  </div>
</template>
