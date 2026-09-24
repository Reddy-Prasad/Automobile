<script setup>
import { onMounted } from 'vue'
import ResourceState from '@/components/common/ResourceState.vue'
import SectionHeading from '@/components/common/SectionHeading.vue'
import { useRequests } from '@/composables/useRequests'
import { formatDate } from '@/utils/format'

const {
  testDrives,
  applications,
  status,
  error,
  load,
  retry,
  confirmDrive,
  cancelDrive,
  updateApplication,
  removeApplication,
} = useRequests()

onMounted(() => {
  load()
})
</script>

<template>
  <section class="py-5">
    <div class="container">
      <SectionHeading
        eyebrow="Your requests"
        title="Test drives and finance applications"
        subtitle="This page reads POST / PATCH / DELETE from the mock API. Refresh keeps the in-memory data until you restart the dev server."
      />

      <ResourceState
        :status="status"
        :error="error"
        empty-title="No requests yet"
        empty-text="Book a test drive or submit a finance application on a vehicle page."
        @retry="retry"
      >
        <template #empty>
          <RouterLink class="btn btn-primary mt-3" :to="{ name: 'vehicles' }">
            Browse inventory
          </RouterLink>
        </template>

        <div class="row g-4">
          <div class="col-lg-6">
            <h2 class="h5 fw-bold">Test drives</h2>
            <div v-if="!testDrives.length" class="text-body-secondary">None yet.</div>
            <div v-for="drive in testDrives" :key="drive.id" class="card border-0 shadow-sm mb-3">
              <div class="card-body">
                <p class="fw-semibold mb-1">{{ drive.customerName }}</p>
                <p class="small text-body-secondary mb-2">
                  Vehicle #{{ drive.vehicleId }} · {{ drive.day }} · {{ drive.status }}
                </p>
                <div class="d-flex flex-wrap gap-2">
                  <button
                    type="button"
                    class="btn btn-outline-primary btn-sm"
                    :disabled="drive.status === 'confirmed'"
                    @click="confirmDrive(drive.id)"
                  >
                    Confirm (PATCH)
                  </button>
                  <button
                    type="button"
                    class="btn btn-outline-danger btn-sm"
                    @click="cancelDrive(drive.id)"
                  >
                    Cancel (DELETE)
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div class="col-lg-6">
            <h2 class="h5 fw-bold">Finance applications</h2>
            <div v-if="!applications.length" class="text-body-secondary">None yet.</div>
            <div
              v-for="application in applications"
              :key="application.id"
              class="card border-0 shadow-sm mb-3"
            >
              <div class="card-body">
                <p class="fw-semibold mb-1">{{ application.vehicleTitle }}</p>
                <p class="small text-body-secondary mb-2">
                  {{ application.name }} · submitted {{ formatDate(application.createdAt) }}
                </p>
                <div class="d-flex flex-wrap gap-2">
                  <button
                    type="button"
                    class="btn btn-outline-primary btn-sm"
                    @click="updateApplication(application, { termMonths: 48 })"
                  >
                    Switch to 48 months (PUT)
                  </button>
                  <button
                    type="button"
                    class="btn btn-outline-danger btn-sm"
                    @click="removeApplication(application.id)"
                  >
                    Withdraw (DELETE)
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ResourceState>
    </div>
  </section>
</template>
