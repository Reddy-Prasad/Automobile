<script setup>
import { statusBadge, statusLabel } from '@/data/workflow'

defineProps({
  status: { type: String, required: true },
})
</script>

<template>
  <span class="badge" :class="statusBadge(status)">{{ statusLabel(status) }}</span>
</template>
