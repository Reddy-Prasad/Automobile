<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import FormField from '@/components/FormField.vue'
import { useVehicleStore } from '@/stores/vehicleStore'
import { validateVehicle } from '@/utils/validate'

const route = useRoute()
const router = useRouter()
const vehicleStore = useVehicleStore()

const isNew = computed(() => route.name === 'inventory-new')
const form = reactive(emptyForm())
const errors = reactive({})
const message = ref('')
const saving = ref(false)

function emptyForm() {
  return {
    stockNumber: '',
    condition: 'new',
    year: 2026,
    make: '',
    model: '',
    trim: '',
    bodyType: 'SUV',
    fuelType: 'Gas',
    transmission: 'Automatic',
    availability: 'AVAILABLE',
    drivetrain: 'FWD',
    mileage: 10,
    msrp: '',
    price: '',
    efficiency: '',
    exteriorColor: '',
    colorHex: '#6c757d',
    image: '/images/vehicles/honda-accord.jpg',
    featured: false,
  }
}

onMounted(async () => {
  if (isNew.value) return
  const vehicle = await vehicleStore.loadOne(route.params.id).catch(() => null)
  if (vehicle) Object.assign(form, vehicle)
})

async function onSubmit() {
  const next = validateVehicle(form)
  Object.keys(errors).forEach((key) => delete errors[key])
  Object.assign(errors, next)
  if (Object.keys(next).length) return

  saving.value = true
  message.value = ''
  const payload = {
    ...form,
    year: Number(form.year),
    mileage: Number(form.mileage),
    price: Number(form.price),
    msrp: form.msrp === '' ? undefined : Number(form.msrp),
  }
  try {
    if (isNew.value) {
      const created = await vehicleStore.create(payload)
      await router.replace({ name: 'inventory-view', params: { id: created.id } })
      return
    }
    await vehicleStore.save(route.params.id, payload)
    message.value = 'Saved. If this unit is published, the client mock will pick up the overlay on refresh.'
  } catch (error) {
    message.value = error.message
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <div>
    <RouterLink class="small" :to="{ name: 'inventory' }">← Inventory</RouterLink>
    <h1 class="h3 fw-bold mt-2">{{ isNew ? 'Create vehicle' : 'Edit vehicle' }}</h1>
    <p class="text-body-secondary">
      Form → Vue → <code>vehicleService</code> → mock API. New units start as draft.
    </p>

    <div v-if="message" class="alert alert-info">{{ message }}</div>

    <form class="card border-0 shadow-sm" novalidate @submit.prevent="onSubmit">
      <div class="card-body p-4 row g-3">
        <div class="col-md-4">
          <FormField label="Stock number" for-id="stockNumber" :error="errors.stockNumber">
            <input id="stockNumber" v-model.trim="form.stockNumber" class="form-control" />
          </FormField>
        </div>
        <div class="col-md-4">
          <FormField label="Make" for-id="make" :error="errors.make">
            <input id="make" v-model.trim="form.make" class="form-control" />
          </FormField>
        </div>
        <div class="col-md-4">
          <FormField label="Model" for-id="model" :error="errors.model">
            <input id="model" v-model.trim="form.model" class="form-control" />
          </FormField>
        </div>
        <div class="col-md-4">
          <FormField label="Trim" for-id="trim">
            <input id="trim" v-model.trim="form.trim" class="form-control" />
          </FormField>
        </div>
        <div class="col-md-2">
          <FormField label="Year" for-id="year" :error="errors.year">
            <input id="year" v-model.number="form.year" type="number" class="form-control" />
          </FormField>
        </div>
        <div class="col-md-3">
          <FormField label="Price" for-id="price" :error="errors.price">
            <input id="price" v-model.number="form.price" type="number" class="form-control" />
          </FormField>
        </div>
        <div class="col-md-3">
          <FormField label="MSRP" for-id="msrp">
            <input id="msrp" v-model.number="form.msrp" type="number" class="form-control" />
          </FormField>
        </div>
        <div class="col-md-3">
          <label for="vehicle-condition" class="form-label small fw-semibold">Condition</label>
          <select id="vehicle-condition" v-model="form.condition" class="form-select">
            <option value="new">New</option>
            <option value="used">Used</option>
            <option value="cpo">CPO</option>
          </select>
        </div>
        <div class="col-md-3">
          <label for="vehicle-body" class="form-label small fw-semibold">Body</label>
          <select id="vehicle-body" v-model="form.bodyType" class="form-select">
            <option>SUV</option>
            <option>Sedan</option>
            <option>Truck</option>
            <option>Van</option>
          </select>
        </div>
        <div class="col-md-3">
          <label for="vehicle-fuel" class="form-label small fw-semibold">Fuel</label>
          <select id="vehicle-fuel" v-model="form.fuelType" class="form-select">
            <option>Gas</option>
            <option>Hybrid</option>
            <option>Electric</option>
          </select>
        </div>
        <div class="col-md-3">
          <label for="vehicle-availability" class="form-label small fw-semibold">Availability</label>
          <select id="vehicle-availability" v-model="form.availability" class="form-select">
            <option value="AVAILABLE">Available</option>
            <option value="IN_TRANSIT">In transit</option>
            <option value="RESERVED">Reserved</option>
          </select>
        </div>
        <div class="col-md-4">
          <FormField label="Mileage" for-id="mileage">
            <input id="mileage" v-model.number="form.mileage" type="number" class="form-control" />
          </FormField>
        </div>
        <div class="col-md-4">
          <FormField label="Color" for-id="exteriorColor">
            <input id="exteriorColor" v-model.trim="form.exteriorColor" class="form-control" />
          </FormField>
        </div>
        <div class="col-md-4">
          <FormField label="Image path" for-id="image">
            <input id="image" v-model.trim="form.image" class="form-control" />
          </FormField>
        </div>
        <div class="col-12">
          <div class="form-check">
            <input id="featured" v-model="form.featured" class="form-check-input" type="checkbox" />
            <label class="form-check-label" for="featured">Featured on the homepage</label>
          </div>
        </div>
        <div class="col-12">
          <button class="btn btn-primary" type="submit" :disabled="saving">
            {{ isNew ? 'Save draft' : 'Save changes' }}
          </button>
        </div>
      </div>
    </form>
  </div>
</template>
