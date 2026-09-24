<script setup>
import { computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import SectionHeading from '@/components/common/SectionHeading.vue'
import { useFinanceApply } from '@/composables/useFinanceApply'
import { useLoanCalculator } from '@/composables/useLoanCalculator'
import { useAuthStore } from '@/stores/authStore'
import { EMPLOYMENT_OPTIONS } from '@/utils/finance'
import { formatCurrency, formatCurrencyPrecise } from '@/utils/format'

const route = useRoute()
const authStore = useAuthStore()

const {
  TERM_OPTIONS,
  vehiclePrice,
  downPayment,
  apr,
  termMonths,
  loanAmount,
  monthlyEmi,
  totalInterest,
  totalPayment,
  applyQuery,
} = useLoanCalculator()

const {
  form,
  errors,
  status,
  error,
  record,
  submitted,
  submit,
  reset,
  applyQuote,
  simulateError,
} = useFinanceApply()

const canUseQuote = computed(() => loanAmount.value > 0)

function fieldClass(name) {
  return submitted.value && errors.value[name] ? 'form-control is-invalid' : 'form-control'
}

function selectClass(name) {
  return submitted.value && errors.value[name] ? 'form-select is-invalid' : 'form-select'
}

function useCalculatorNumbers() {
  applyQuote({
    loanAmount: loanAmount.value,
    termMonths: termMonths.value,
  })
}

async function onSubmit() {
  try {
    await submit({
      vehiclePrice: vehiclePrice.value,
      downPayment: downPayment.value,
      apr: apr.value,
      monthlyEmi: monthlyEmi.value,
    })
  } catch {
    // status/error live on the composable
  }
}

onMounted(() => {
  applyQuery(route.query)
  if (route.query.loan) form.loanAmount = Number(route.query.loan) || ''
  if (route.query.term) form.termMonths = Number(route.query.term) || 60
  if (authStore.user) {
    form.name = form.name || authStore.user.name
    form.email = form.email || authStore.user.email
  }
  if (canUseQuote.value && !form.loanAmount) useCalculatorNumbers()
})

watch(
  () => route.query,
  (query) => applyQuery(query),
)
</script>

<template>
  <section class="bg-body-tertiary border-bottom py-5">
    <div class="container">
      <SectionHeading
        eyebrow="Financing"
        title="Payment calculator and application"
        subtitle="The estimate uses computed(). The application is local form state, then POST /finance-applications. This is not a Pinia store."
      />
    </div>
  </section>

  <section class="py-5">
    <div class="container">
      <div class="row g-5">
        <div class="col-lg-6">
          <div class="card border-0 shadow-sm h-100">
            <div class="card-body p-4">
              <h2 class="h5 fw-bold mb-1">
                <i class="bi bi-calculator me-2 text-primary"></i>Loan calculator
              </h2>
              <p class="small text-body-secondary mb-4">
                Change a field. EMI, interest and total update immediately — no submit.
              </p>

              <div class="row g-3">
                <div class="col-sm-6">
                  <label for="calc-price" class="form-label small fw-semibold">Vehicle price</label>
                  <div class="input-group">
                    <span class="input-group-text">$</span>
                    <input
                      id="calc-price"
                      v-model.number="vehiclePrice"
                      type="number"
                      min="0"
                      step="500"
                      class="form-control"
                    />
                  </div>
                </div>
                <div class="col-sm-6">
                  <label for="calc-down" class="form-label small fw-semibold">Down payment</label>
                  <div class="input-group">
                    <span class="input-group-text">$</span>
                    <input
                      id="calc-down"
                      v-model.number="downPayment"
                      type="number"
                      min="0"
                      step="500"
                      class="form-control"
                    />
                  </div>
                </div>
                <div class="col-sm-6">
                  <label for="calc-apr" class="form-label small fw-semibold">Interest rate (APR)</label>
                  <div class="input-group">
                    <input
                      id="calc-apr"
                      v-model.number="apr"
                      type="number"
                      min="0"
                      max="30"
                      step="0.1"
                      class="form-control"
                    />
                    <span class="input-group-text">%</span>
                  </div>
                </div>
                <div class="col-sm-6">
                  <label for="calc-term" class="form-label small fw-semibold">Loan tenure</label>
                  <select id="calc-term" v-model.number="termMonths" class="form-select">
                    <option v-for="term in TERM_OPTIONS" :key="term" :value="term">
                      {{ term }} months
                    </option>
                  </select>
                </div>
              </div>

              <dl class="row mt-4 mb-0">
                <dt class="col-6">Loan amount</dt>
                <dd class="col-6 text-end">{{ formatCurrencyPrecise(loanAmount) }}</dd>
                <dt class="col-6">Monthly EMI</dt>
                <dd class="col-6 text-end fw-bold text-primary fs-4">
                  {{ formatCurrencyPrecise(monthlyEmi) }}
                </dd>
                <dt class="col-6">Total interest</dt>
                <dd class="col-6 text-end">{{ formatCurrencyPrecise(totalInterest) }}</dd>
                <dt class="col-6">Total payment</dt>
                <dd class="col-6 text-end">{{ formatCurrencyPrecise(totalPayment) }}</dd>
              </dl>

              <button
                type="button"
                class="btn btn-outline-primary mt-3"
                :disabled="!canUseQuote"
                @click="useCalculatorNumbers"
              >
                Use these numbers in the application
              </button>
              <p class="small text-body-secondary mt-3 mb-0">
                Estimate only. Excludes tax, title, registration and dealer fees.
              </p>
            </div>
          </div>
        </div>

        <div class="col-lg-6">
          <div class="card border-0 shadow-sm h-100">
            <div class="card-body p-4">
              <h2 class="h5 fw-bold mb-1">Finance application</h2>
              <p class="small text-body-secondary mb-4">
                Vue validates first. Only a valid form calls the service.
              </p>

              <div v-if="status === 'success'" class="alert alert-success mb-0">
                <p class="fw-semibold mb-1">Application #{{ record.id }} received</p>
                <p class="mb-3">
                  Thanks {{ record.name }}. We will review a
                  {{ formatCurrency(record.loanAmount) }} loan for
                  {{ record.termMonths }} months.
                </p>
                <div class="d-flex flex-wrap gap-2">
                  <RouterLink class="btn btn-success" :to="{ name: 'requests' }">
                    View in My requests
                  </RouterLink>
                  <button type="button" class="btn btn-outline-success" @click="reset()">
                    Start another
                  </button>
                </div>
              </div>

              <div v-else-if="status === 'error'" class="alert alert-danger">
                <p class="fw-semibold mb-1">The request failed</p>
                <p class="small mb-3">{{ error?.message || 'Something went wrong.' }}</p>
                <div class="d-flex flex-wrap gap-2">
                  <button type="button" class="btn btn-danger" @click="onSubmit">Retry</button>
                  <button type="button" class="btn btn-outline-danger" @click="reset()">
                    Edit form
                  </button>
                </div>
              </div>

              <form v-else class="row g-3" novalidate @submit.prevent="onSubmit">
                <div class="col-12">
                  <label for="app-name" class="form-label small fw-semibold">Name</label>
                  <input id="app-name" v-model.trim="form.name" :class="fieldClass('name')" />
                  <div v-if="errors.name" class="invalid-feedback">{{ errors.name }}</div>
                </div>
                <div class="col-md-6">
                  <label for="app-email" class="form-label small fw-semibold">Email</label>
                  <input
                    id="app-email"
                    v-model.trim="form.email"
                    type="email"
                    :class="fieldClass('email')"
                  />
                  <div v-if="errors.email" class="invalid-feedback">{{ errors.email }}</div>
                </div>
                <div class="col-md-6">
                  <label for="app-phone" class="form-label small fw-semibold">Phone</label>
                  <input
                    id="app-phone"
                    v-model.trim="form.phone"
                    type="tel"
                    placeholder="(214) 555-0199"
                    :class="fieldClass('phone')"
                  />
                  <div v-if="errors.phone" class="invalid-feedback">{{ errors.phone }}</div>
                </div>
                <div class="col-md-6">
                  <label for="app-job" class="form-label small fw-semibold">Employment</label>
                  <select id="app-job" v-model="form.employment" :class="selectClass('employment')">
                    <option disabled value="">Select</option>
                    <option v-for="option in EMPLOYMENT_OPTIONS" :key="option" :value="option">
                      {{ option }}
                    </option>
                  </select>
                  <div v-if="errors.employment" class="invalid-feedback">
                    {{ errors.employment }}
                  </div>
                </div>
                <div class="col-md-6">
                  <label for="app-income" class="form-label small fw-semibold">Monthly income</label>
                  <div class="input-group">
                    <span class="input-group-text">$</span>
                    <input
                      id="app-income"
                      v-model.number="form.monthlyIncome"
                      type="number"
                      min="0"
                      step="100"
                      :class="fieldClass('monthlyIncome')"
                    />
                  </div>
                  <div v-if="errors.monthlyIncome" class="invalid-feedback d-block">
                    {{ errors.monthlyIncome }}
                  </div>
                </div>
                <div class="col-md-6">
                  <label for="app-loan" class="form-label small fw-semibold">Loan amount</label>
                  <div class="input-group">
                    <span class="input-group-text">$</span>
                    <input
                      id="app-loan"
                      v-model.number="form.loanAmount"
                      type="number"
                      min="1"
                      step="100"
                      :class="fieldClass('loanAmount')"
                    />
                  </div>
                  <div v-if="errors.loanAmount" class="invalid-feedback d-block">
                    {{ errors.loanAmount }}
                  </div>
                </div>
                <div class="col-md-6">
                  <label for="app-term" class="form-label small fw-semibold">Preferred tenure</label>
                  <select
                    id="app-term"
                    v-model.number="form.termMonths"
                    :class="selectClass('termMonths')"
                  >
                    <option v-for="term in TERM_OPTIONS" :key="term" :value="term">
                      {{ term }} months
                    </option>
                  </select>
                  <div v-if="errors.termMonths" class="invalid-feedback">
                    {{ errors.termMonths }}
                  </div>
                </div>
                <div class="col-12 d-flex flex-wrap gap-2">
                  <button
                    type="submit"
                    class="btn btn-primary"
                    :disabled="status === 'loading'"
                  >
                    {{ status === 'loading' ? 'Sending…' : 'Submit application (POST)' }}
                  </button>
                  <button
                    type="button"
                    class="btn btn-outline-danger"
                    :disabled="status === 'loading'"
                    @click="simulateError()"
                  >
                    Simulate API error
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
