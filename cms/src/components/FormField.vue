<script setup>
defineProps({
  label: { type: String, required: true },
  forId: { type: String, required: true },
  error: { type: String, default: '' },
  hint: { type: String, default: '' },
})
</script>

<template>
  <div>
    <label :for="forId" class="form-label small fw-semibold">{{ label }}</label>
    <slot />
    <div v-if="error" class="invalid-feedback d-block">{{ error }}</div>
    <div v-else-if="hint" class="form-text">{{ hint }}</div>
  </div>
</template>
