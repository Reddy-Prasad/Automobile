<script setup>
defineProps({
  loading: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  submitLabel: { type: String, default: 'Submit' },
})

defineEmits(['reset', 'fail'])
</script>

<template>
  <div class="d-flex flex-wrap gap-2">
    <button type="submit" class="btn btn-primary" :disabled="disabled || loading">
      {{ loading ? 'Sending…' : submitLabel }}
    </button>
    <button type="button" class="btn btn-outline-secondary" :disabled="loading" @click="$emit('reset')">
      Reset form
    </button>
    <button
      type="button"
      class="btn btn-outline-danger"
      :disabled="loading || disabled"
      @click="$emit('fail')"
    >
      Simulate API error
    </button>
    <p v-if="disabled && !loading" class="small text-body-secondary w-100 mb-0">
      Fill every required field to enable Submit.
    </p>
  </div>
</template>
