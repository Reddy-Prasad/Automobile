<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ResourceState from '@/components/common/ResourceState.vue'
import VehicleActions from '@/components/vehicles/VehicleActions.vue'
import VehicleCard from '@/components/vehicles/VehicleCard.vue'
import VehicleGallery from '@/components/vehicles/VehicleGallery.vue'
import { useFinanceApplication } from '@/composables/useFinanceApplication'
import { useTestDriveRequest } from '@/composables/useTestDriveRequest'
import { useVehicle } from '@/composables/useVehicle'
import { conditionLabels } from '@/data/vehicles'
import { formatCurrency, formatMileage } from '@/utils/format'

const props = defineProps({
  id: { type: [String, Number], required: true },
})

const route = useRoute()
const router = useRouter()

const {
  vehicle,
  similar,
  title,
  features,
  gallery,
  location,
  dealer,
  status,
  error,
  retry,
  saveVehicle,
} = useVehicle(() => props.id)

const drive = useTestDriveRequest()
const finance = useFinanceApplication()

const isCompared = ref(false)
const compareNote = ref('')
const panel = ref('')

const savings = computed(() => {
  if (!vehicle.value?.msrp) return 0
  return vehicle.value.msrp - vehicle.value.price
})

const monthlyEstimate = computed(() => {
  if (!vehicle.value) return 0
  const principal = Math.max(vehicle.value.price - finance.form.downPayment, 0)
  const months = finance.form.termMonths
  const monthlyRate = 6.9 / 100 / 12
  if (principal === 0) return 0
  return (principal * monthlyRate) / (1 - (1 + monthlyRate) ** -months)
})

watch(
  () => props.id,
  () => {
    isCompared.value = false
    compareNote.value = ''
    drive.reset()
    finance.reset()
    panel.value = typeof route.query.action === 'string' ? route.query.action : ''
  },
  { immediate: true },
)

watch(
  [vehicle, title],
  () => {
    document.title = vehicle.value ? `${title.value} | AutoDrive` : 'Vehicle | AutoDrive'
  },
)

function openPanel(name) {
  panel.value = panel.value === name ? '' : name
}

async function onFavorite() {
  await saveVehicle({ saved: !vehicle.value.saved })
}

function onCompare() {
  isCompared.value = !isCompared.value
  compareNote.value = isCompared.value
    ? 'Added to compare. A side-by-side compare page comes later.'
    : ''
}

function onFinance() {
  openPanel('finance')
}

function onTestDrive() {
  openPanel('testdrive')
}

function onTradeIn() {
  router.push({
    name: 'home',
    hash: '#trade-in',
    query: { vehicle: String(props.id) },
  })
}

async function submitDrive() {
  try {
    await drive.submit(props.id)
  } catch {
    // status/error live on the composable
  }
}

async function submitFinance() {
  try {
    await finance.submit(vehicle.value)
  } catch {
    // status/error live on the composable
  }
}

function onGallerySelect(item) {
  panel.value = item.id === 'paint' ? '' : panel.value
}
</script>

<template>
  <section class="container py-5">
    <ResourceState
      :status="status"
      :error="error"
      empty-title="Vehicle not found"
      empty-text="That id is not in the mock API. Try 1–24."
      @retry="retry"
    >
      <template #empty>
        <RouterLink class="btn btn-primary mt-3" :to="{ name: 'vehicles' }">
          Back to inventory
        </RouterLink>
      </template>
  <article v-if="vehicle">
    <div class="bg-body-tertiary border-bottom py-3">
      <div class="container">
        <nav aria-label="breadcrumb">
          <ol class="breadcrumb mb-0 small">
            <li class="breadcrumb-item">
              <RouterLink :to="{ name: 'home' }">Home</RouterLink>
            </li>
            <li class="breadcrumb-item">
              <RouterLink :to="{ name: 'vehicles' }">Inventory</RouterLink>
            </li>
            <li class="breadcrumb-item active" aria-current="page">{{ title }}</li>
          </ol>
        </nav>
      </div>
    </div>

    <div class="container py-5">
      <div class="row g-5">
        <div class="col-lg-7">
          <VehicleGallery :items="gallery" :alt="title" @select="onGallerySelect" />
        </div>

        <div class="col-lg-5">
          <p class="text-primary fw-semibold text-uppercase small mb-1">
            {{ conditionLabels[vehicle.condition] }} ·
            {{ vehicle.availability.replaceAll('_', ' ') }}
          </p>
          <h1 class="h2 fw-bold mb-1">{{ title }}</h1>
          <p class="text-body-secondary mb-3">{{ vehicle.trim }} · Stock #{{ vehicle.stockNumber }}</p>

          <div class="d-flex align-items-baseline flex-wrap gap-2 mb-2">
            <span class="display-6 fw-bold">{{ formatCurrency(vehicle.price) }}</span>
            <span v-if="savings > 0" class="text-body-secondary text-decoration-line-through">
              MSRP {{ formatCurrency(vehicle.msrp) }}
            </span>
          </div>
          <p v-if="savings > 0" class="text-success fw-semibold">
            Save {{ formatCurrency(savings) }} off MSRP
          </p>

          <ul class="list-unstyled d-flex flex-wrap gap-3 text-body-secondary mb-4">
            <li><i class="bi bi-calendar3 me-1"></i>{{ vehicle.year }}</li>
            <li><i class="bi bi-speedometer2 me-1"></i>{{ formatMileage(vehicle.mileage) }}</li>
            <li><i class="bi bi-fuel-pump me-1"></i>{{ vehicle.fuelType }}</li>
            <li><i class="bi bi-gear me-1"></i>{{ vehicle.transmission }}</li>
            <li><i class="bi bi-car-front me-1"></i>{{ vehicle.bodyType }}</li>
          </ul>

          <VehicleActions
            :is-favorite="Boolean(vehicle.saved)"
            :is-compared="isCompared"
            :test-drive-disabled="vehicle.availability === 'RESERVED'"
            @favorite="onFavorite"
            @compare="onCompare"
            @finance="onFinance"
            @testdrive="onTestDrive"
            @tradein="onTradeIn"
          />

          <p v-if="vehicle.availability === 'RESERVED'" class="small text-danger mt-2 mb-0">
            This vehicle is reserved, so a test drive cannot be booked right now.
          </p>
          <p v-if="compareNote" class="small text-body-secondary mt-2 mb-0">{{ compareNote }}</p>

          <div v-if="panel === 'finance'" id="finance-panel" class="card border-0 shadow-sm mt-4">
            <div class="card-body">
              <h2 class="h6 fw-bold">Estimated payment</h2>
              <p class="display-6 fw-bold mb-1">{{ formatCurrency(monthlyEstimate) }}/mo</p>
              <p v-if="finance.status === 'success'" class="text-success">
                Application #{{ finance.record.id }} submitted.
              </p>
              <p v-else-if="finance.status === 'error'" class="text-danger small">
                {{ finance.error.message }}
              </p>
              <form v-else class="row g-3" @submit.prevent="submitFinance">
                <div class="col-12">
                  <label for="finance-name" class="form-label small">Name</label>
                  <input id="finance-name" v-model.trim="finance.form.name" class="form-control" required />
                </div>
                <div class="col-12">
                  <label for="finance-email" class="form-label small">Email</label>
                  <input id="finance-email" v-model.trim="finance.form.email" type="email" class="form-control" />
                </div>
                <div class="col-12">
                  <button
                    type="submit"
                    class="btn btn-primary"
                    :disabled="finance.status === 'loading'"
                  >
                    {{ finance.status === 'loading' ? 'Sending…' : 'Submit application (POST)' }}
                  </button>
                </div>
              </form>
            </div>
          </div>

          <div v-if="panel === 'testdrive'" id="testdrive-panel" class="card border-0 shadow-sm mt-4">
            <div class="card-body">
              <h2 class="h6 fw-bold">Request a test drive</h2>
              <p v-if="drive.status === 'success'" class="text-success mb-0">
                Thanks {{ drive.form.name }}. Request #{{ drive.record.id }} is in My requests.
              </p>
              <p v-else-if="drive.status === 'error'" class="text-danger small">{{ drive.error.message }}</p>
              <form v-else class="row g-3" @submit.prevent="submitDrive">
                <div class="col-12">
                  <label for="drive-name" class="form-label small">Name</label>
                  <input id="drive-name" v-model.trim="drive.form.name" class="form-control" required />
                </div>
                <div class="col-md-6">
                  <label for="drive-phone" class="form-label small">Phone</label>
                  <input id="drive-phone" v-model.trim="drive.form.phone" class="form-control" required />
                </div>
                <div class="col-md-6">
                  <label for="drive-day" class="form-label small">Preferred day</label>
                  <input id="drive-day" v-model="drive.form.day" type="date" class="form-control" required />
                </div>
                <div class="col-12">
                  <button type="submit" class="btn btn-primary" :disabled="drive.status === 'loading'">
                    {{ drive.status === 'loading' ? 'Sending…' : 'Send request (POST)' }}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <div class="row g-5 mt-1">
        <div class="col-lg-7">
          <h2 class="h4 fw-bold">Features</h2>
          <ul class="row row-cols-1 row-cols-sm-2 list-unstyled mb-5">
            <li v-for="feature in features" :key="feature" class="d-flex gap-2 mb-2">
              <i class="bi bi-check-circle-fill text-success"></i>
              <span>{{ feature }}</span>
            </li>
          </ul>

          <h2 class="h4 fw-bold">Specifications</h2>
          <div class="table-responsive">
            <table class="table">
              <tbody>
                <tr>
                  <th scope="row" class="w-25">Year</th>
                  <td>{{ vehicle.year }}</td>
                </tr>
                <tr>
                  <th scope="row">Make / model</th>
                  <td>{{ vehicle.make }} {{ vehicle.model }}</td>
                </tr>
                <tr>
                  <th scope="row">Trim</th>
                  <td>{{ vehicle.trim }}</td>
                </tr>
                <tr>
                  <th scope="row">Body</th>
                  <td>{{ vehicle.bodyType }}</td>
                </tr>
                <tr>
                  <th scope="row">Fuel</th>
                  <td>{{ vehicle.fuelType }}</td>
                </tr>
                <tr>
                  <th scope="row">Transmission</th>
                  <td>{{ vehicle.transmission }}</td>
                </tr>
                <tr>
                  <th scope="row">Drivetrain</th>
                  <td>{{ vehicle.drivetrain }}</td>
                </tr>
                <tr>
                  <th scope="row">Mileage</th>
                  <td>{{ formatMileage(vehicle.mileage) }}</td>
                </tr>
                <tr>
                  <th scope="row">Exterior</th>
                  <td>{{ vehicle.exteriorColor }}</td>
                </tr>
                <tr>
                  <th scope="row">Efficiency</th>
                  <td>{{ vehicle.efficiency }}</td>
                </tr>
                <tr>
                  <th scope="row">Condition</th>
                  <td>{{ conditionLabels[vehicle.condition] }}</td>
                </tr>
                <tr>
                  <th scope="row">Stock #</th>
                  <td>{{ vehicle.stockNumber }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="col-lg-5">
          <h2 class="h4 fw-bold">Dealer</h2>
          <div class="card border-0 shadow-sm mb-4">
            <div class="card-body">
              <p class="fw-semibold mb-1">{{ dealer.name }}</p>
              <p class="small text-body-secondary mb-3">{{ dealer.tagline }}</p>
              <p class="mb-1">
                <i class="bi bi-telephone me-2"></i>
                <a :href="dealer.phoneHref">{{ dealer.phone }}</a>
              </p>
              <p class="mb-0">
                <i class="bi bi-envelope me-2"></i>
                <a :href="`mailto:${dealer.email}`">{{ dealer.email }}</a>
              </p>
            </div>
          </div>

          <h2 class="h4 fw-bold">Location</h2>
          <div class="card border-0 shadow-sm">
            <div class="card-body">
              <p class="fw-semibold mb-1">{{ location.name }}</p>
              <p class="mb-1">
                {{ location.street }}<br />
                {{ location.city }}, {{ location.state }} {{ location.zip }}
              </p>
              <p class="mb-3">
                <a :href="location.phoneHref">{{ location.phone }}</a>
              </p>
              <ul class="list-unstyled small mb-0">
                <li v-for="slot in location.hours" :key="slot.days">
                  {{ slot.days }}: {{ slot.time }}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <section v-if="similar.length" class="mt-5">
        <h2 class="h4 fw-bold mb-4">Similar vehicles</h2>
        <div class="row row-cols-1 row-cols-sm-2 row-cols-xl-3 g-4">
          <div v-for="item in similar" :key="item.id" class="col">
            <VehicleCard :vehicle="item" />
          </div>
        </div>
      </section>
    </div>
  </article>
    </ResourceState>
  </section>
</template>
