<script setup>
defineProps({
  status: { type: String, required: true },
  error: { type: Object, default: null },
  emptyTitle: { type: String, default: 'Nothing here yet' },
  emptyText: { type: String, default: '' },
})

defineEmits(['retry'])
</script>

<template>
  <div v-if="status === 'initial'" class="text-body-secondary py-4">Ready to load.</div>

  <div v-else-if="status === 'loading'" class="text-center py-5">
    <div class="spinner-border text-primary" role="status">
      <span class="visually-hidden">Loading</span>
    </div>
    <p class="mt-3 mb-0 text-body-secondary">Talking to the API…</p>
  </div>

  <div v-else-if="status === 'error'" class="alert alert-danger d-flex flex-column flex-sm-row align-items-sm-center justify-content-between gap-3">
    <div>
      <p class="fw-semibold mb-1">The request failed</p>
      <p class="mb-0 small">{{ error?.message || 'Something went wrong.' }}</p>
    </div>
    <button type="button" class="btn btn-danger flex-shrink-0" @click="$emit('retry')">
      Retry
    </button>
  </div>

  <div v-else-if="status === 'empty'" class="text-center border rounded-3 bg-body-tertiary py-5 px-3">
    <i class="bi bi-inbox display-4 text-body-secondary"></i>
    <h2 class="h4 mt-3">{{ emptyTitle }}</h2>
    <p v-if="emptyText" class="text-body-secondary mb-0">{{ emptyText }}</p>
    <slot name="empty" />
  </div>

  <slot v-else />
</template>
