<script setup>
import EmptyState from './EmptyState.vue'
import ErrorState from './ErrorState.vue'
import LoadingState from './LoadingState.vue'

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

  <LoadingState v-else-if="status === 'loading'" />

  <ErrorState v-else-if="status === 'error'" :error="error" @retry="$emit('retry')" />

  <EmptyState v-else-if="status === 'empty'" :title="emptyTitle" :text="emptyText">
    <slot name="empty" />
  </EmptyState>

  <slot v-else />
</template>
