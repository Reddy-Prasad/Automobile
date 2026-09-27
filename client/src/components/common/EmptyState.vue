<script setup>
defineProps({
  title: { type: String, default: 'Nothing here yet' },
  text: { type: String, default: '' },
  icon: { type: String, default: 'bi-inbox' },
})
</script>

<template>
  <div class="text-center border rounded-3 bg-body-tertiary py-5 px-3">
    <i :class="['bi', icon, 'display-4 text-body-secondary']"></i>
    <h2 class="h4 mt-3">{{ title }}</h2>
    <p v-if="text" class="text-body-secondary mb-0">{{ text }}</p>
    <slot />
  </div>
</template>
