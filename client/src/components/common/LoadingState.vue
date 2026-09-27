<script setup>
defineProps({
  message: { type: String, default: 'Talking to the API…' },
})
</script>

<template>
  <div class="text-center py-5" role="status" aria-live="polite" aria-busy="true">
    <div class="spinner-border text-primary" aria-hidden="true"></div>
    <p class="mt-3 mb-0 text-body-secondary">{{ message }}</p>
  </div>
</template>
