<script setup>
defineProps({
  steps: { type: Array, required: true },
})
</script>

<template>
  <ol class="list-unstyled d-flex flex-wrap gap-2 mb-4">
    <li v-for="(step, index) in steps" :key="step" class="d-flex align-items-center gap-2 small">
      <span
        class="rounded-circle bg-primary text-white d-inline-flex align-items-center justify-content-center fw-semibold step-dot"
      >
        {{ index + 1 }}
      </span>
      <span class="fw-semibold">{{ step }}</span>
      <i v-if="index < steps.length - 1" class="bi bi-arrow-right text-body-secondary"></i>
    </li>
  </ol>
</template>

<style scoped>
.step-dot {
  width: 1.5rem;
  height: 1.5rem;
  font-size: 0.75rem;
}
</style>
