<script setup>
import AppointmentFields from '@/components/forms/AppointmentFields.vue'
import ContactFields from '@/components/forms/ContactFields.vue'
import FlowSteps from '@/components/forms/FlowSteps.vue'
import FormActions from '@/components/forms/FormActions.vue'
import FormField from '@/components/forms/FormField.vue'
import FormResult from '@/components/forms/FormResult.vue'
import SectionHeading from '@/components/common/SectionHeading.vue'
import { useServiceForm } from '@/composables/useServiceForm'
import { SERVICE_TYPES, YEAR_OPTIONS } from '@/data/booking'

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
} = useServiceForm()

const steps = ['Vehicle', 'Service type', 'Date', 'Time', 'Location', 'Submit']

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
        eyebrow="Service"
        title="Book a service visit"
        subtitle="Date, time and location are the same AppointmentFields used on the test-drive page. Service type is unique here."
      />
      <FlowSteps :steps="steps" />
    </div>
  </section>

  <section class="py-5">
    <div class="container" style="max-width: 48rem">
      <FormResult
        :status="status"
        :error="error"
        title="Service appointment booked"
        @retry="retry"
        @reset="reset"
      >
        <p class="mb-0">
          Request #{{ record?.id }} · {{ record?.serviceType }} for {{ record?.vehicleTitle }} on
          {{ record?.date }} at {{ record?.time }}.
        </p>
      </FormResult>

      <form v-if="status !== 'success' && status !== 'error'" class="card border-0 shadow-sm" novalidate @submit.prevent="onSubmit">
        <div class="card-body p-4">
          <div class="row g-3">
            <div class="col-md-4">
              <FormField label="Year" for-id="service-year" :error="errors.year">
                <select id="service-year" v-model="form.year" :class="fieldClass('year', 'select')">
                  <option disabled value="">Year</option>
                  <option v-for="year in YEAR_OPTIONS" :key="year" :value="year">{{ year }}</option>
                </select>
              </FormField>
            </div>
            <div class="col-md-4">
              <FormField label="Make" for-id="service-make" :error="errors.make">
                <input
                  id="service-make"
                  v-model.trim="form.make"
                  placeholder="Toyota"
                  :class="fieldClass('make')"
                />
              </FormField>
            </div>
            <div class="col-md-4">
              <FormField label="Model" for-id="service-model" :error="errors.model">
                <input
                  id="service-model"
                  v-model.trim="form.model"
                  placeholder="Camry"
                  :class="fieldClass('model')"
                />
              </FormField>
            </div>
            <div class="col-12">
              <FormField label="Service type" for-id="service-type" :error="errors.serviceType">
                <select
                  id="service-type"
                  v-model="form.serviceType"
                  :class="fieldClass('serviceType', 'select')"
                >
                  <option disabled value="">Choose a service</option>
                  <option v-for="type in SERVICE_TYPES" :key="type" :value="type">{{ type }}</option>
                </select>
              </FormField>
            </div>
            <AppointmentFields :form="form" :errors="errors" :field-class="fieldClass" />
            <ContactFields :form="form" :errors="errors" :field-class="fieldClass" />
            <div class="col-12">
              <FormActions
                :loading="isLoading"
                :disabled="submitDisabled"
                submit-label="Submit service booking (POST)"
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
