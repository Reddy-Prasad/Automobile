<script setup>
defineProps({
  title: { type: String, default: 'Nothing here yet' },
  text: { type: String, default: '' },
})
</script>

<template>
  <div class="text-center py-5 text-body-secondary">
    <p class="fw-semibold mb-1">{{ title }}</p>
    <p v-if="text" class="small mb-0">{{ text }}</p>
  </div>
</template>
