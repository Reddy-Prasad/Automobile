<script setup>
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useOperationsStore } from '@/stores/operationsStore'

const operations = useOperationsStore()
const { reports, status } = storeToRefs(operations)

onMounted(() => operations.loadReports())
</script>

<template>
  <div>
    <h1 class="h3 fw-bold mb-4">Reports</h1>
    <div v-if="status === 'loading'" class="alert alert-secondary">Crunching mock numbers…</div>
    <template v-else-if="reports">
      <div class="row g-3 mb-4">
        <div class="col-md-3">
          <div class="card border-0 shadow-sm">
            <div class="card-body">
              <p class="small text-body-secondary mb-1">Published</p>
              <p class="h3 mb-0">{{ reports.inventory.published }}</p>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card border-0 shadow-sm">
            <div class="card-body">
              <p class="small text-body-secondary mb-1">Draft</p>
              <p class="h3 mb-0">{{ reports.inventory.draft }}</p>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card border-0 shadow-sm">
            <div class="card-body">
              <p class="small text-body-secondary mb-1">Leads</p>
              <p class="h3 mb-0">{{ reports.pipeline.leads }}</p>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card border-0 shadow-sm">
            <div class="card-body">
              <p class="small text-body-secondary mb-1">Service</p>
              <p class="h3 mb-0">{{ reports.pipeline.service }}</p>
            </div>
          </div>
        </div>
      </div>
      <div class="card border-0 shadow-sm">
        <div class="card-body">
          <h2 class="h5">Units by make</h2>
          <ul class="mb-0">
            <li v-for="(count, make) in reports.byMake" :key="make">{{ make }} — {{ count }}</li>
          </ul>
        </div>
      </div>
    </template>
  </div>
</template>
