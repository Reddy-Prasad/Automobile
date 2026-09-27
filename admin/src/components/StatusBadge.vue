<script setup>
const tones = {
  draft: 'text-bg-secondary',
  published: 'text-bg-success',
  new: 'text-bg-primary',
  contacted: 'text-bg-info',
  qualified: 'text-bg-success',
  lost: 'text-bg-dark',
  scheduled: 'text-bg-warning',
  confirmed: 'text-bg-info',
  completed: 'text-bg-success',
  cancelled: 'text-bg-secondary',
  submitted: 'text-bg-primary',
  pending: 'text-bg-warning',
  approved: 'text-bg-success',
  declined: 'text-bg-danger',
  appraised: 'text-bg-info',
  accepted: 'text-bg-success',
  in_progress: 'text-bg-info',
  AVAILABLE: 'text-bg-success',
  IN_TRANSIT: 'text-bg-warning',
  RESERVED: 'text-bg-info',
  SOLD: 'text-bg-dark',
  HOLD: 'text-bg-secondary',
}

defineProps({
  status: { type: [String, Number], required: true },
})
</script>

<template>
  <span class="badge" :class="tones[status] ?? 'text-bg-light'">{{ status }}</span>
</template>
