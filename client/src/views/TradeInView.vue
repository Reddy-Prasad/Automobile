<script setup>
import ContactFields from '@/components/forms/ContactFields.vue'
import FlowSteps from '@/components/forms/FlowSteps.vue'
import FormActions from '@/components/forms/FormActions.vue'
import FormField from '@/components/forms/FormField.vue'
import FormResult from '@/components/forms/FormResult.vue'
import SectionHeading from '@/components/common/SectionHeading.vue'
import { useTradeInForm } from '@/composables/useTradeInForm'
import { CONDITION_OPTIONS, YEAR_OPTIONS } from '@/data/booking'
import { formatCurrency } from '@/utils/format'

const {
  form,
  errors,
  status,
  error,
  record,
  suggestedValue,
  submitDisabled,
  isLoading,
  fieldClass,
  submit,
  reset,
  retry,
  simulateError,
} = useTradeInForm()

const steps = ['Current vehicle', 'Year', 'Mileage', 'Condition', 'Expected value', 'Submit']

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
        eyebrow="Trade-in"
        title="What's your car worth?"
        subtitle="Expected value is a computed estimate you can edit. Date/time/location are not reused — this is not an appointment."
      />
      <FlowSteps :steps="steps" />
    </div>
  </section>

  <section class="py-5">
    <div class="container" style="max-width: 48rem">
      <FormResult
        :status="status"
        :error="error"
        title="Trade-in request received"
        @retry="retry"
        @reset="reset"
      >
        <p class="mb-0">
          Request #{{ record?.id }} for {{ record?.vehicleTitle }}. We will review
          {{ formatCurrency(record?.expectedValue) }}.
        </p>
      </FormResult>

      <form v-if="status !== 'success' && status !== 'error'" class="card border-0 shadow-sm" novalidate @submit.prevent="onSubmit">
        <div class="card-body p-4">
          <div class="row g-3">
            <div class="col-md-6">
              <FormField label="Make" for-id="trade-make" :error="errors.make">
                <input
                  id="trade-make"
                  v-model.trim="form.make"
                  placeholder="Honda"
                  :class="fieldClass('make')"
                />
              </FormField>
            </div>
            <div class="col-md-6">
              <FormField label="Model" for-id="trade-model" :error="errors.model">
                <input
                  id="trade-model"
                  v-model.trim="form.model"
                  placeholder="Civic"
                  :class="fieldClass('model')"
                />
              </FormField>
            </div>
            <div class="col-md-4">
              <FormField label="Year" for-id="trade-year" :error="errors.year">
                <select id="trade-year" v-model="form.year" :class="fieldClass('year', 'select')">
                  <option disabled value="">Year</option>
                  <option v-for="year in YEAR_OPTIONS" :key="year" :value="year">{{ year }}</option>
                </select>
              </FormField>
            </div>
            <div class="col-md-4">
              <FormField label="Mileage" for-id="trade-miles" :error="errors.mileage">
                <input
                  id="trade-miles"
                  v-model.number="form.mileage"
                  type="number"
                  min="0"
                  step="500"
                  :class="fieldClass('mileage')"
                />
              </FormField>
            </div>
            <div class="col-md-4">
              <FormField label="Condition" for-id="trade-condition" :error="errors.condition">
                <select
                  id="trade-condition"
                  v-model="form.condition"
                  :class="fieldClass('condition', 'select')"
                >
                  <option v-for="option in CONDITION_OPTIONS" :key="option" :value="option">
                    {{ option }}
                  </option>
                </select>
              </FormField>
            </div>
            <div class="col-12">
              <FormField
                label="Expected value"
                for-id="trade-value"
                :error="errors.expectedValue"
                :hint="`Suggested from year, mileage and condition: ${formatCurrency(suggestedValue)}`"
              >
                <div class="input-group">
                  <span class="input-group-text">$</span>
                  <input
                    id="trade-value"
                    v-model.number="form.expectedValue"
                    type="number"
                    min="1"
                    step="100"
                    :class="fieldClass('expectedValue')"
                  />
                </div>
              </FormField>
            </div>
            <ContactFields :form="form" :errors="errors" :field-class="fieldClass" email />
            <div class="col-12">
              <FormActions
                :loading="isLoading"
                :disabled="submitDisabled"
                submit-label="Submit trade-in (POST)"
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
