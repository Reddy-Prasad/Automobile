<script setup>
defineProps({
  open: { type: Boolean, default: false },
  title: { type: String, required: true },
})

const emit = defineEmits(['close', 'confirm'])
</script>

<template>
  <div v-if="open" class="position-fixed top-0 start-0 w-100 h-100" style="z-index: 1050">
    <div class="position-absolute top-0 start-0 w-100 h-100 bg-dark opacity-50" @click="emit('close')" />
    <div class="position-relative d-flex align-items-center justify-content-center h-100 p-3">
      <div class="card shadow" style="max-width: 420px; width: 100%">
        <div class="card-body p-4">
          <h2 class="h5">{{ title }}</h2>
          <div class="text-body-secondary mb-4">
            <slot />
          </div>
          <div class="d-flex justify-content-end gap-2">
            <button type="button" class="btn btn-outline-secondary" @click="emit('close')">Cancel</button>
            <button type="button" class="btn btn-danger" @click="emit('confirm')">Confirm</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
