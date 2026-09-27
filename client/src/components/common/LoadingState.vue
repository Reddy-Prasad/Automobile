<script setup>
defineProps({
  message: { type: String, default: 'Talking to the API…' },
})
</script>

<template>
  <div class="text-center py-5">
    <div class="spinner-border text-primary" role="status">
      <span class="visually-hidden">Loading</span>
    </div>
    <p class="mt-3 mb-0 text-body-secondary">{{ message }}</p>
  </div>
</template>
