<script setup>
import { onMounted } from 'vue'
import ResourceState from '@/components/common/ResourceState.vue'
import SectionHeading from '@/components/common/SectionHeading.vue'
import { useRequests } from '@/composables/useRequests'
import { formatCurrency, formatDate } from '@/utils/format'

const {
  testDrives,
  applications,
  serviceBookings,
  tradeIns,
  status,
  error,
  load,
  retry,
  confirmDrive,
  cancelDrive,
  updateApplication,
  removeApplication,
  cancelService,
  cancelTradeIn,
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
        title="Your bookings and applications"
        subtitle="Same accountStore as /account. This page shows every mock record so you can practice PATCH / PUT / DELETE."
      />

      <ResourceState
        :status="status"
        :error="error"
        empty-title="No requests yet"
        empty-text="Book a test drive, service visit, trade-in or finance application."
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
                  Vehicle #{{ drive.vehicleId }} · {{ drive.day }}
                  <template v-if="drive.time"> · {{ drive.time }}</template>
                  <template v-if="drive.locationName"> · {{ drive.locationName }}</template>
                  · {{ drive.status }}
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

          <div class="col-lg-6">
            <h2 class="h5 fw-bold">Service bookings</h2>
            <div v-if="!serviceBookings.length" class="text-body-secondary">None yet.</div>
            <div
              v-for="booking in serviceBookings"
              :key="booking.id"
              class="card border-0 shadow-sm mb-3"
            >
              <div class="card-body">
                <p class="fw-semibold mb-1">{{ booking.serviceType }}</p>
                <p class="small text-body-secondary mb-2">
                  {{ booking.vehicleTitle }} · {{ booking.date }} {{ booking.time }} ·
                  {{ booking.locationName }}
                </p>
                <button
                  type="button"
                  class="btn btn-outline-danger btn-sm"
                  @click="cancelService(booking.id)"
                >
                  Cancel (DELETE)
                </button>
              </div>
            </div>
          </div>

          <div class="col-lg-6">
            <h2 class="h5 fw-bold">Trade-ins</h2>
            <div v-if="!tradeIns.length" class="text-body-secondary">None yet.</div>
            <div v-for="item in tradeIns" :key="item.id" class="card border-0 shadow-sm mb-3">
              <div class="card-body">
                <p class="fw-semibold mb-1">{{ item.vehicleTitle }}</p>
                <p class="small text-body-secondary mb-2">
                  {{ item.name }} · {{ item.condition }} · asked
                  {{ formatCurrency(item.expectedValue) }}
                </p>
                <button
                  type="button"
                  class="btn btn-outline-danger btn-sm"
                  @click="cancelTradeIn(item.id)"
                >
                  Withdraw (DELETE)
                </button>
              </div>
            </div>
          </div>
        </div>
      </ResourceState>
    </div>
  </section>
</template>
