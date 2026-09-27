<script setup>
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useOperationsStore } from '@/stores/operationsStore'

const operations = useOperationsStore()
const { items, status } = storeToRefs(operations)

onMounted(() => operations.loadBoard('dealers'))
</script>

<template>
  <div>
    <p class="small text-uppercase text-primary fw-semibold mb-1">Network</p>
    <h1 class="h3 fw-bold mb-4">Dealers</h1>
    <div v-if="status === 'loading'" class="alert alert-secondary">Loading stores…</div>
    <div class="row g-3">
      <div v-for="store in items" :key="store.id" class="col-md-4">
        <div class="card border-0 shadow-sm h-100">
          <div class="card-body">
            <h2 class="h5">{{ store.name }}</h2>
            <p class="small mb-1">{{ store.street }}</p>
            <p class="small mb-1">{{ store.city }}, {{ store.state }} {{ store.zip }}</p>
            <p class="small mb-0">{{ store.phone }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
