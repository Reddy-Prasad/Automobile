<script setup>
import { storeToRefs } from 'pinia'
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
import AppointmentFields from '@/components/forms/AppointmentFields.vue'
import ContactFields from '@/components/forms/ContactFields.vue'
import FlowSteps from '@/components/forms/FlowSteps.vue'
import FormActions from '@/components/forms/FormActions.vue'
import FormField from '@/components/forms/FormField.vue'
import FormResult from '@/components/forms/FormResult.vue'
import SectionHeading from '@/components/common/SectionHeading.vue'
import { useTestDriveForm } from '@/composables/useTestDriveForm'
import { useAuthStore } from '@/stores/authStore'
import { useVehicleStore } from '@/stores/vehicleStore'
import { vehicleTitle } from '@/utils/vehicles'

const route = useRoute()
const vehicleStore = useVehicleStore()
const authStore = useAuthStore()
const { items: vehicles } = storeToRefs(vehicleStore)

const {
  form,
  errors,
  status,
  error,
  record,
  submitDisabled,
  isLoading,
  fieldClass,
  submit,
  reset,
  retry,
  simulateError,
} = useTestDriveForm()

const steps = ['Vehicle', 'Date', 'Time', 'Location', 'Submit']

onMounted(() => {
  vehicleStore.loadVehicles().catch(() => {})
  if (route.query.vehicle) form.vehicleId = String(route.query.vehicle)
  if (authStore.user) form.name = form.name || authStore.user.name
})

async function onSubmit() {
  try {
    await submit()
  } catch {
    // status lives on the composable
  }
}
</script>

<template>
  <section class="bg-body-tertiary border-bottom py-5">
    <div class="container">
      <SectionHeading
        eyebrow="Test drive"
        title="Book a drive"
        subtitle="Shared pieces: appointment fields, contact fields, form actions, and useFormSubmit. This page only owns the vehicle picker."
      />
      <FlowSteps :steps="steps" />
    </div>
  </section>

  <section class="py-5">
    <div class="container" style="max-width: 48rem">
      <FormResult
        :status="status"
        :error="error"
        title="Test drive requested"
        @retry="retry"
        @reset="reset"
      >
        <p class="mb-0">
          Request #{{ record?.id }} for {{ record?.customerName }} on {{ record?.day }} at
          {{ record?.time }} · {{ record?.locationName }}.
        </p>
      </FormResult>

      <form v-if="status !== 'success' && status !== 'error'" class="card border-0 shadow-sm" novalidate @submit.prevent="onSubmit">
        <div class="card-body p-4">
          <div class="row g-3">
            <div class="col-12">
              <FormField label="Vehicle" for-id="drive-vehicle" :error="errors.vehicleId">
                <select
                  id="drive-vehicle"
                  v-model="form.vehicleId"
                  :class="fieldClass('vehicleId', 'select')"
                >
                  <option disabled value="">Choose from inventory</option>
                  <option v-for="vehicle in vehicles" :key="vehicle.id" :value="String(vehicle.id)">
                    {{ vehicleTitle(vehicle) }} · {{ vehicle.trim }}
                  </option>
                </select>
              </FormField>
            </div>
            <AppointmentFields :form="form" :errors="errors" :field-class="fieldClass" />
            <ContactFields :form="form" :errors="errors" :field-class="fieldClass" />
            <div class="col-12">
              <FormActions
                :loading="isLoading"
                :disabled="submitDisabled"
                submit-label="Submit test drive (POST)"
                @reset="reset"
                @fail="simulateError"
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  </section>
</template>
