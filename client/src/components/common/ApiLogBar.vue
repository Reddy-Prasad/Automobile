<script setup>
import { requestLog } from '@/api/requestLog'
</script>

<template>
  <div v-if="requestLog.length" class="bg-black text-white-50 small py-2">
    <div class="container d-flex flex-wrap align-items-center gap-2">
      <span class="text-white fw-semibold me-2">API</span>
      <span
        v-for="entry in requestLog.slice(0, 4)"
        :key="entry.id"
        class="badge"
        :class="entry.ok ? 'text-bg-success' : 'text-bg-danger'"
      >
        {{ entry.method }} {{ entry.path }} · {{ entry.status }} · {{ entry.ms }}ms
      </span>
      <span class="ms-auto">Open the console for the full log</span>
    </div>
  </div>
</template>
