<script setup>
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import StatusBadge from '@/components/StatusBadge.vue'
import { failNextRequest } from '@/api/http'
import { STATUS_LABELS } from '@/data/workflow'
import { useContentStore } from '@/stores/contentStore'

const contentStore = useContentStore()
const { dashboard, status, error } = storeToRefs(contentStore)

onMounted(() => {
  contentStore.loadDashboard().catch(() => {})
})

function retry() {
  contentStore.loadDashboard().catch(() => {})
}

function simulateError() {
  failNextRequest()
  retry()
}

const cards = [
  { key: 'draft', tone: 'secondary' },
  { key: 'in_review', tone: 'warning' },
  { key: 'approved', tone: 'info' },
  { key: 'published', tone: 'success' },
]
</script>

<template>
  <div>
    <div class="d-flex flex-wrap justify-content-between align-items-start gap-3 mb-4">
      <div>
        <p class="small text-uppercase text-primary fw-semibold mb-1">Overview</p>
        <h1 class="h3 fw-bold mb-1">CMS dashboard</h1>
        <p class="text-body-secondary mb-0">
          Editor → Save draft → Review → Approve → Publish → mock API → client website.
        </p>
      </div>
      <button type="button" class="btn btn-outline-danger btn-sm" @click="simulateError">
        Simulate API error
      </button>
    </div>

    <div v-if="status === 'loading'" class="alert alert-secondary">Loading dashboard…</div>
    <div v-else-if="status === 'error'" class="alert alert-danger">
      {{ error?.message }}
      <button type="button" class="btn btn-sm btn-outline-danger ms-2" @click="retry">Retry</button>
    </div>

    <template v-else-if="dashboard">
      <div class="row g-3 mb-4">
        <div v-for="card in cards" :key="card.key" class="col-6 col-lg-3">
          <div class="card border-0 shadow-sm h-100">
            <div class="card-body">
              <p class="small text-body-secondary mb-1">{{ STATUS_LABELS[card.key] }}</p>
              <p class="display-6 fw-bold mb-0">{{ dashboard.counts[card.key] }}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="card border-0 shadow-sm mb-4">
        <div class="card-body">
          <h2 class="h5">Publishing pipeline</h2>
          <ol class="mb-0">
            <li><strong>Editor</strong> writes copy and clicks Save draft.</li>
            <li><strong>Editor</strong> submits the draft for review.</li>
            <li><strong>Reviewer</strong> approves or returns it to draft.</li>
            <li><strong>Admin</strong> publishes. The mock API writes <code>cms-published.json</code>.</li>
            <li>Refresh the <strong>client</strong> site at port 5173 to see live content.</li>
          </ol>
        </div>
      </div>

      <div class="card border-0 shadow-sm">
        <div class="card-body">
          <h2 class="h5">Recently updated</h2>
          <div class="table-responsive">
            <table class="table align-middle mb-0">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Status</th>
                  <th>By</th>
                  <th>When</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="row in dashboard.recent" :key="row.id + row.updatedAt">
                  <td>{{ row.title }}</td>
                  <td><StatusBadge :status="row.status" /></td>
                  <td>{{ row.updatedBy }}</td>
                  <td class="small text-body-secondary">{{ row.updatedAt.replace('T', ' ').slice(0, 16) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
