<script setup>
import { computed, ref } from 'vue'
import { formatCurrency } from '@/utils/format'

const termOptions = [36, 48, 60, 72, 84]

const vehiclePrice = ref(35000)
const downPayment = ref(5000)
const termMonths = ref(60)
const apr = ref(6.9)

const amountFinanced = computed(() => Math.max(vehiclePrice.value - downPayment.value, 0))

const monthlyPayment = computed(() => {
  const principal = amountFinanced.value
  const months = termMonths.value
  const monthlyRate = apr.value / 100 / 12

  if (principal === 0) return 0
  if (monthlyRate === 0) return principal / months
  return (principal * monthlyRate) / (1 - (1 + monthlyRate) ** -months)
})

const totalInterest = computed(() =>
  Math.max(monthlyPayment.value * termMonths.value - amountFinanced.value, 0),
)

const benefits = [
  'Pre-qualify in minutes with no impact to your credit score',
  'Rates from 20+ national and local lenders',
  'Options for first-time buyers and rebuilding credit',
]
</script>

<template>
  <section id="finance" class="py-5">
    <div class="container">
      <div class="row g-5 align-items-center">
        <div class="col-lg-5">
          <p class="text-primary fw-semibold text-uppercase small mb-1">Financing</p>
          <h2 class="fw-bold">Know your payment before you visit</h2>
          <p class="text-body-secondary">
            Adjust the numbers to see an estimated monthly payment. Our finance team will shop
            lenders to find you the best rate.
          </p>
          <ul class="list-unstyled mb-4">
            <li v-for="benefit in benefits" :key="benefit" class="d-flex gap-2 mb-2">
              <i class="bi bi-check-circle-fill text-success"></i>
              <span>{{ benefit }}</span>
            </li>
          </ul>
          <RouterLink class="btn btn-primary btn-lg" :to="{ name: 'home', hash: '#contact' }">
            Get pre-approved
          </RouterLink>
        </div>

        <div class="col-lg-7">
          <div class="card border-0 shadow">
            <div class="card-body p-4">
              <h3 class="h5 fw-bold mb-4">
                <i class="bi bi-calculator me-2 text-primary"></i>Payment calculator
              </h3>

              <div class="row g-3">
                <div class="col-sm-6">
                  <label for="finance-price" class="form-label small fw-semibold">
                    Vehicle price
                  </label>
                  <div class="input-group">
                    <span class="input-group-text">$</span>
                    <input
                      id="finance-price"
                      v-model.number="vehiclePrice"
                      type="number"
                      min="0"
                      step="500"
                      class="form-control"
                    />
                  </div>
                </div>

                <div class="col-sm-6">
                  <label for="finance-down" class="form-label small fw-semibold">
                    Down payment
                  </label>
                  <div class="input-group">
                    <span class="input-group-text">$</span>
                    <input
                      id="finance-down"
                      v-model.number="downPayment"
                      type="number"
                      min="0"
                      step="500"
                      class="form-control"
                    />
                  </div>
                </div>

                <div class="col-sm-6">
                  <label for="finance-term" class="form-label small fw-semibold">Term</label>
                  <select id="finance-term" v-model.number="termMonths" class="form-select">
                    <option v-for="term in termOptions" :key="term" :value="term">
                      {{ term }} months
                    </option>
                  </select>
                </div>

                <div class="col-sm-6">
                  <label for="finance-apr" class="form-label small fw-semibold">
                    Interest rate (APR)
                  </label>
                  <div class="input-group">
                    <input
                      id="finance-apr"
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
              </div>

              <div class="bg-primary text-white rounded-3 p-4 mt-4">
                <div class="row g-3 align-items-center text-center text-sm-start">
                  <div class="col-sm-6">
                    <p class="small mb-1">Estimated monthly payment</p>
                    <p class="display-6 fw-bold mb-0">{{ formatCurrency(monthlyPayment) }}</p>
                  </div>
                  <div class="col-sm-6 small">
                    <div class="d-flex justify-content-between">
                      <span>Amount financed</span>
                      <span>{{ formatCurrency(amountFinanced) }}</span>
                    </div>
                    <div class="d-flex justify-content-between">
                      <span>Total interest</span>
                      <span>{{ formatCurrency(totalInterest) }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <p class="small text-body-secondary mt-3 mb-0">
                Estimate only. Excludes tax, title, registration and fees. Actual rate depends on
                credit approval.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
