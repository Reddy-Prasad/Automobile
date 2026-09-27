<script setup>
defineProps({
  error: { type: Object, default: null },
})

defineEmits(['retry'])
</script>

<template>
  <div
    class="alert alert-danger d-flex flex-column flex-sm-row align-items-sm-center justify-content-between gap-3"
  >
    <div>
      <p class="fw-semibold mb-1">The request failed</p>
      <p class="mb-0 small">{{ error?.message || 'Something went wrong.' }}</p>
    </div>
    <button type="button" class="btn btn-danger flex-shrink-0" @click="$emit('retry')">
      Retry
    </button>
  </div>
</template>
