<script setup>
const tones = {
  confirmed: 'text-bg-success',
  scheduled: 'text-bg-info',
  submitted: 'text-bg-primary',
  pending: 'text-bg-warning',
  cancelled: 'text-bg-secondary',
  withdrawn: 'text-bg-secondary',
  available: 'text-bg-success',
  reserved: 'text-bg-warning',
}

defineProps({
  status: { type: String, default: '' },
})

function tone(status) {
  return tones[String(status).toLowerCase()] || 'text-bg-light border'
}
</script>

<template>
  <span class="badge text-capitalize" :class="tone(status)">{{ status || '—' }}</span>
</template>
