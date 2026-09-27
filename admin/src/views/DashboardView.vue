<script setup>
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { failNextRequest } from '@/api/http'
import { useOperationsStore } from '@/stores/operationsStore'

const operations = useOperationsStore()
const { dashboard, status, error } = storeToRefs(operations)

onMounted(() => operations.loadDashboard())

function simulateError() {
  failNextRequest()
  operations.loadDashboard()
}

const cards = [
  { key: 'draft', label: 'Draft vehicles', from: 'vehicles' },
  { key: 'published', label: 'On the lot', from: 'vehicles' },
  { key: 'leads', label: 'Leads' },
  { key: 'service', label: 'Service jobs' },
]
</script>

<template>
  <div>
    <div class="d-flex flex-wrap justify-content-between gap-3 mb-4">
      <div>
        <p class="small text-uppercase text-primary fw-semibold mb-1">Overview</p>
        <h1 class="h3 fw-bold mb-1">Admin dashboard</h1>
        <p class="text-body-secondary mb-0">
          Operations only. Website copy lives in the CMS. Shoppers live on the client.
        </p>
      </div>
      <button type="button" class="btn btn-outline-danger btn-sm" @click="simulateError">
        Simulate API error
      </button>
    </div>

    <div v-if="status === 'loading'" class="alert alert-secondary">Loading dashboard…</div>
    <div v-else-if="status === 'error'" class="alert alert-danger">
      {{ error?.message }}
      <button type="button" class="btn btn-sm btn-outline-danger ms-2" @click="operations.loadDashboard()">
        Retry
      </button>
    </div>

    <template v-else-if="dashboard">
      <div class="row g-3 mb-4">
        <div v-for="card in cards" :key="card.label" class="col-6 col-lg-3">
          <div class="card border-0 shadow-sm h-100">
            <div class="card-body">
              <p class="small text-body-secondary mb-1">{{ card.label }}</p>
              <p class="display-6 fw-bold mb-0">
                {{ card.from ? dashboard.vehicles[card.key] : dashboard[card.key] }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div class="card border-0 shadow-sm">
        <div class="card-body">
          <h2 class="h5">How a vehicle reaches the client</h2>
          <ol class="mb-0">
            <li>Admin form saves through <code>vehicleService</code> to the mock API.</li>
            <li>The vehicle stays <strong>draft</strong> — shoppers do not see it.</li>
            <li>Publish writes <code>admin-published.json</code>.</li>
            <li>The client mock merges that file, then <code>vehicleService.listVehicles()</code> returns it.</li>
          </ol>
        </div>
      </div>
    </template>
  </div>
</template>
