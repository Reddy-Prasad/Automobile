<script setup>
import { onMounted } from 'vue'
import DataTable from '@/components/common/DataTable.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import ErrorState from '@/components/common/ErrorState.vue'
import LoadingState from '@/components/common/LoadingState.vue'
import Modal from '@/components/common/Modal.vue'
import Pagination from '@/components/common/Pagination.vue'
import SectionHeading from '@/components/common/SectionHeading.vue'
import StatusBadge from '@/components/common/StatusBadge.vue'
import { useAccount } from '@/composables/useAccount'
import { formatCurrency, formatDate, formatMileage } from '@/utils/format'
import { vehicleTitle } from '@/utils/vehicles'

const {
  sections,
  user,
  roleName,
  token,
  status,
  error,
  favorites,
  favoriteCount,
  compared,
  compareCount,
  drives,
  services,
  applications,
  trades,
  drivePage,
  servicePage,
  financePage,
  tradePage,
  modal,
  accountStore,
  favoriteStore,
  compareStore,
  authStore,
  ask,
  closeModal,
  confirmModal,
  load,
  retry,
} = useAccount()

const favoriteColumns = [
  { key: 'title', label: 'Vehicle' },
  { key: 'price', label: 'Price' },
  { key: 'stock', label: 'Stock' },
  { key: 'actions', label: '' },
]

const compareColumns = [
  { key: 'title', label: 'Vehicle' },
  { key: 'price', label: 'Price' },
  { key: 'miles', label: 'Mileage' },
  { key: 'actions', label: '' },
]

const driveColumns = [
  { key: 'when', label: 'When' },
  { key: 'vehicle', label: 'Vehicle' },
  { key: 'place', label: 'Location' },
  { key: 'status', label: 'Status' },
  { key: 'actions', label: '' },
]

const serviceColumns = [
  { key: 'when', label: 'When' },
  { key: 'vehicle', label: 'Vehicle' },
  { key: 'type', label: 'Service' },
  { key: 'status', label: 'Status' },
  { key: 'actions', label: '' },
]

const financeColumns = [
  { key: 'vehicle', label: 'Vehicle' },
  { key: 'loan', label: 'Loan' },
  { key: 'term', label: 'Term' },
  { key: 'status', label: 'Status' },
  { key: 'actions', label: '' },
]

const tradeColumns = [
  { key: 'vehicle', label: 'Vehicle' },
  { key: 'asked', label: 'Asked' },
  { key: 'condition', label: 'Condition' },
  { key: 'status', label: 'Status' },
  { key: 'actions', label: '' },
]

onMounted(() => {
  load()
})

function removeFavorite(vehicle) {
  ask({
    title: 'Remove favorite',
    message: `Remove ${vehicleTitle(vehicle)} from saved vehicles?`,
    confirmLabel: 'Remove',
    danger: true,
    run: () => favoriteStore.remove(vehicle.id),
  })
}

function removeCompared(vehicle) {
  ask({
    title: 'Remove from compare',
    message: `Remove ${vehicleTitle(vehicle)} from compare?`,
    confirmLabel: 'Remove',
    danger: true,
    run: () => compareStore.remove(vehicle.id),
  })
}

function cancelDrive(drive) {
  ask({
    title: 'Cancel test drive',
    message: `Cancel the ${drive.day} visit at ${drive.locationName}?`,
    confirmLabel: 'Cancel booking',
    danger: true,
    run: () => accountStore.cancelDrive(drive.id),
  })
}

function cancelService(booking) {
  ask({
    title: 'Cancel service',
    message: `Cancel ${booking.serviceType} on ${booking.date}?`,
    confirmLabel: 'Cancel visit',
    danger: true,
    run: () => accountStore.cancelService(booking.id),
  })
}

function withdrawFinance(application) {
  ask({
    title: 'Withdraw application',
    message: `Withdraw the finance application for ${application.vehicleTitle}?`,
    confirmLabel: 'Withdraw',
    danger: true,
    run: () => accountStore.removeApplication(application.id),
  })
}

function withdrawTrade(item) {
  ask({
    title: 'Withdraw trade-in',
    message: `Withdraw the trade-in for ${item.vehicleTitle}?`,
    confirmLabel: 'Withdraw',
    danger: true,
    run: () => accountStore.cancelTradeIn(item.id),
  })
}
</script>

<template>
  <section class="bg-body-tertiary border-bottom py-5">
    <div class="container">
      <SectionHeading
        eyebrow="Client app · /account"
        title="Your account"
        subtitle="One page, seven sections. The view talks to useAccount. Shared lists live in Pinia. Lists of bookings come from the mock API."
      />
    </div>
  </section>

  <section class="py-5">
    <div class="container">
      <div class="row g-4">
        <aside class="col-lg-3">
          <nav class="list-group sticky-top" style="top: 5.5rem">
            <a
              v-for="section in sections"
              :key="section.id"
              class="list-group-item list-group-item-action"
              :href="`#${section.id}`"
            >
              {{ section.label }}
            </a>
          </nav>
          <button
            type="button"
            class="btn btn-outline-danger btn-sm w-100 mt-3"
            @click="accountStore.simulateError().catch(() => {})"
          >
            Simulate API error
          </button>
        </aside>

        <div class="col-lg-9">
          <section id="profile" class="mb-5">
            <h2 class="h4 fw-bold">Profile</h2>
            <div class="card border-0 shadow-sm">
              <div class="card-body p-4">
                <p class="small text-uppercase text-body-secondary mb-1">GET /auth/me</p>
                <h3 class="h5 fw-bold mb-1">{{ user.name }}</h3>
                <p class="mb-3">
                  {{ user.email }}
                  <span class="badge text-bg-primary ms-2">{{ roleName }}</span>
                </p>
                <p class="small text-body-secondary mb-2">This tab’s mock token</p>
                <code class="d-block small text-break mb-3">{{ token }}</code>
                <button
                  type="button"
                  class="btn btn-outline-primary btn-sm"
                  @click="authStore.refreshUser()"
                >
                  Refresh current user
                </button>
              </div>
            </div>
          </section>

          <section id="favorites" class="mb-5">
            <h2 class="h4 fw-bold">Favorites</h2>
            <p class="small text-body-secondary">favoriteStore · shared with cards and /saved</p>
            <EmptyState
              v-if="!favoriteCount"
              title="No saved vehicles"
              text="Heart a vehicle on inventory or details."
              icon="bi-heart"
            >
              <RouterLink class="btn btn-primary mt-3" :to="{ name: 'vehicles' }">
                Browse inventory
              </RouterLink>
            </EmptyState>
            <div v-else class="card border-0 shadow-sm">
              <DataTable :columns="favoriteColumns" :rows="favorites">
                <template #cell-title="{ row }">
                  <RouterLink :to="{ name: 'vehicle-details', params: { id: String(row.id) } }">
                    {{ vehicleTitle(row) }}
                  </RouterLink>
                </template>
                <template #cell-price="{ row }">{{ formatCurrency(row.price) }}</template>
                <template #cell-stock="{ row }">{{ row.stockNumber }}</template>
                <template #cell-actions="{ row }">
                  <button type="button" class="btn btn-outline-danger btn-sm" @click="removeFavorite(row)">
                    Remove
                  </button>
                </template>
              </DataTable>
            </div>
          </section>

          <section id="compare" class="mb-5">
            <h2 class="h4 fw-bold">Compare</h2>
            <p class="small text-body-secondary">compareStore · up to 3 vehicles</p>
            <EmptyState
              v-if="!compareCount"
              title="Compare is empty"
              text="Add vehicles from a card or the details page."
              icon="bi-columns"
            >
              <RouterLink class="btn btn-primary mt-3" :to="{ name: 'compare' }">
                Open full compare
              </RouterLink>
            </EmptyState>
            <div v-else class="card border-0 shadow-sm">
              <DataTable :columns="compareColumns" :rows="compared">
                <template #cell-title="{ row }">
                  <RouterLink :to="{ name: 'vehicle-details', params: { id: String(row.id) } }">
                    {{ vehicleTitle(row) }}
                  </RouterLink>
                </template>
                <template #cell-price="{ row }">{{ formatCurrency(row.price) }}</template>
                <template #cell-miles="{ row }">{{ formatMileage(row.mileage) }}</template>
                <template #cell-actions="{ row }">
                  <button type="button" class="btn btn-outline-danger btn-sm" @click="removeCompared(row)">
                    Remove
                  </button>
                </template>
              </DataTable>
            </div>
          </section>

          <ErrorState v-if="status === 'error'" :error="error" @retry="retry" />
          <LoadingState v-else-if="status === 'loading'" message="Loading your bookings…" />

          <template v-else>
            <section id="test-drives" class="mb-5">
              <h2 class="h4 fw-bold">Test drives</h2>
              <p class="small text-body-secondary">accountStore → testDriveService → GET /test-drives</p>
              <EmptyState
                v-if="!drives.length"
                title="No test drives"
                text="Book a drive from inventory."
                icon="bi-car-front"
              >
                <RouterLink class="btn btn-primary mt-3" :to="{ name: 'test-drive' }">
                  Book a test drive
                </RouterLink>
              </EmptyState>
              <div v-else class="card border-0 shadow-sm">
                <DataTable :columns="driveColumns" :rows="drivePage.rows">
                  <template #cell-when="{ row }">
                    {{ formatDate(row.day) }}
                    <span v-if="row.time"> · {{ row.time }}</span>
                  </template>
                  <template #cell-vehicle="{ row }">Vehicle #{{ row.vehicleId }}</template>
                  <template #cell-place="{ row }">{{ row.locationName }}</template>
                  <template #cell-status="{ row }">
                    <StatusBadge :status="row.status" />
                  </template>
                  <template #cell-actions="{ row }">
                    <div class="d-flex flex-wrap gap-2">
                      <button
                        type="button"
                        class="btn btn-outline-primary btn-sm"
                        :disabled="row.status === 'confirmed'"
                        @click="accountStore.confirmDrive(row.id)"
                      >
                        Confirm
                      </button>
                      <button type="button" class="btn btn-outline-danger btn-sm" @click="cancelDrive(row)">
                        Cancel
                      </button>
                    </div>
                  </template>
                </DataTable>
                <div class="card-footer bg-white">
                  <Pagination v-model:page="drivePage.page" :page-count="drivePage.pages" />
                </div>
              </div>
            </section>

            <section id="service" class="mb-5">
              <h2 class="h4 fw-bold">Service appointments</h2>
              <EmptyState
                v-if="!services.length"
                title="No service bookings"
                text="Schedule oil, tires or inspection."
                icon="bi-tools"
              >
                <RouterLink class="btn btn-primary mt-3" :to="{ name: 'service' }">Book service</RouterLink>
              </EmptyState>
              <div v-else class="card border-0 shadow-sm">
                <DataTable :columns="serviceColumns" :rows="servicePage.rows">
                  <template #cell-when="{ row }">{{ formatDate(row.date) }} · {{ row.time }}</template>
                  <template #cell-vehicle="{ row }">{{ row.vehicleTitle }}</template>
                  <template #cell-type="{ row }">{{ row.serviceType }}</template>
                  <template #cell-status="{ row }">
                    <StatusBadge :status="row.status" />
                  </template>
                  <template #cell-actions="{ row }">
                    <button type="button" class="btn btn-outline-danger btn-sm" @click="cancelService(row)">
                      Cancel
                    </button>
                  </template>
                </DataTable>
                <div class="card-footer bg-white">
                  <Pagination v-model:page="servicePage.page" :page-count="servicePage.pages" />
                </div>
              </div>
            </section>

            <section id="finance" class="mb-5">
              <h2 class="h4 fw-bold">Finance applications</h2>
              <EmptyState
                v-if="!applications.length"
                title="No finance applications"
                text="Run the calculator and apply."
                icon="bi-calculator"
              >
                <RouterLink class="btn btn-primary mt-3" :to="{ name: 'finance' }">Go to finance</RouterLink>
              </EmptyState>
              <div v-else class="card border-0 shadow-sm">
                <DataTable :columns="financeColumns" :rows="financePage.rows">
                  <template #cell-vehicle="{ row }">{{ row.vehicleTitle }}</template>
                  <template #cell-loan="{ row }">{{ formatCurrency(row.loanAmount) }}</template>
                  <template #cell-term="{ row }">{{ row.termMonths }} months</template>
                  <template #cell-status="{ row }">
                    <StatusBadge :status="row.status" />
                  </template>
                  <template #cell-actions="{ row }">
                    <button
                      type="button"
                      class="btn btn-outline-danger btn-sm"
                      @click="withdrawFinance(row)"
                    >
                      Withdraw
                    </button>
                  </template>
                </DataTable>
                <div class="card-footer bg-white">
                  <Pagination v-model:page="financePage.page" :page-count="financePage.pages" />
                </div>
              </div>
            </section>

            <section id="trade-ins" class="mb-5">
              <h2 class="h4 fw-bold">Trade-ins</h2>
              <EmptyState
                v-if="!trades.length"
                title="No trade-in requests"
                text="Get an estimate on your current car."
                icon="bi-arrow-left-right"
              >
                <RouterLink class="btn btn-primary mt-3" :to="{ name: 'trade-in' }">Start trade-in</RouterLink>
              </EmptyState>
              <div v-else class="card border-0 shadow-sm">
                <DataTable :columns="tradeColumns" :rows="tradePage.rows">
                  <template #cell-vehicle="{ row }">{{ row.vehicleTitle }}</template>
                  <template #cell-asked="{ row }">{{ formatCurrency(row.expectedValue) }}</template>
                  <template #cell-condition="{ row }">{{ row.condition }}</template>
                  <template #cell-status="{ row }">
                    <StatusBadge :status="row.status" />
                  </template>
                  <template #cell-actions="{ row }">
                    <button type="button" class="btn btn-outline-danger btn-sm" @click="withdrawTrade(row)">
                      Withdraw
                    </button>
                  </template>
                </DataTable>
                <div class="card-footer bg-white">
                  <Pagination v-model:page="tradePage.page" :page-count="tradePage.pages" />
                </div>
              </div>
            </section>
          </template>
        </div>
      </div>
    </div>
  </section>

  <Modal
    :open="modal.open"
    :title="modal.title"
    :confirm-label="modal.confirmLabel"
    :danger="modal.danger"
    @confirm="confirmModal"
    @cancel="closeModal"
  >
    <p class="mb-0">{{ modal.message }}</p>
  </Modal>
</template>
