<script setup>
defineProps({
  status: { type: String, required: true },
  error: { type: Object, default: null },
  title: { type: String, default: 'Request received' },
})

defineEmits(['retry', 'reset'])
</script>

<template>
  <div v-if="status === 'success'" class="alert alert-success mb-0">
    <p class="fw-semibold mb-1">{{ title }}</p>
    <slot />
    <div class="d-flex flex-wrap gap-2 mt-3">
      <slot name="success-actions">
        <RouterLink class="btn btn-success" :to="{ name: 'requests' }">View My requests</RouterLink>
      </slot>
      <button type="button" class="btn btn-outline-success" @click="$emit('reset')">
        Start another
      </button>
    </div>
  </div>

  <div v-else-if="status === 'error'" class="alert alert-danger">
    <p class="fw-semibold mb-1">The request failed</p>
    <p class="small mb-3">{{ error?.message || 'Something went wrong.' }}</p>
    <div class="d-flex flex-wrap gap-2">
      <button type="button" class="btn btn-danger" @click="$emit('retry')">Retry</button>
      <button type="button" class="btn btn-outline-danger" @click="$emit('reset')">Edit form</button>
    </div>
  </div>
</template>
