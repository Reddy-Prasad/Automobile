<script setup>
import { computed, reactive, ref } from 'vue'

const conditionOptions = ['Excellent', 'Good', 'Fair', 'Needs work']

const currentYear = new Date().getFullYear()
const yearOptions = Array.from({ length: 20 }, (_, index) => currentYear - index)

const steps = [
  { icon: 'bi-pencil-square', title: 'Tell us about your car', text: 'Year, make, model and mileage.' },
  { icon: 'bi-envelope-check', title: 'Get your estimate', text: 'A specialist replies within 1 business day.' },
  { icon: 'bi-arrow-left-right', title: 'Trade or sell', text: 'Apply it to your next car or take a check.' },
]

function emptyForm() {
  return {
    year: '',
    make: '',
    model: '',
    mileage: '',
    condition: 'Good',
    zip: '',
    email: '',
  }
}

const form = reactive(emptyForm())
const submitted = ref(false)

const vehicleSummary = computed(() => `${form.year} ${form.make} ${form.model}`.trim())

function onSubmit() {
  submitted.value = true
}

function startOver() {
  Object.assign(form, emptyForm())
  submitted.value = false
}
</script>

<template>
  <section id="trade-in" class="py-5 bg-dark text-white">
    <div class="container">
      <div class="row g-5 align-items-center">
        <div class="col-lg-5">
          <p class="text-warning fw-semibold text-uppercase small mb-1">Trade-in</p>
          <h2 class="fw-bold">What's your car worth?</h2>
          <p class="text-white-50 mb-4">
            Get a real offer based on local market data, not a guess. No obligation to buy.
          </p>

          <ol class="list-unstyled mb-0">
            <li v-for="(step, index) in steps" :key="step.title" class="d-flex gap-3 mb-3">
              <span
                class="rounded-circle bg-warning text-dark fw-bold d-flex align-items-center justify-content-center flex-shrink-0 step-number"
              >
                {{ index + 1 }}
              </span>
              <div>
                <p class="fw-semibold mb-0">
                  <i :class="['bi', step.icon, 'me-1']"></i>{{ step.title }}
                </p>
                <p class="small text-white-50 mb-0">{{ step.text }}</p>
              </div>
            </li>
          </ol>
        </div>

        <div class="col-lg-7">
          <div class="card border-0 text-body">
            <div class="card-body p-4">
              <div v-if="submitted" class="text-center py-4">
                <i class="bi bi-check-circle-fill text-success display-4"></i>
                <h3 class="h4 fw-bold mt-3">Thanks! We're on it.</h3>
                <p class="text-body-secondary">
                  We'll email an estimate for your <strong>{{ vehicleSummary }}</strong> to
                  <strong>{{ form.email }}</strong> within 1 business day.
                </p>
                <button type="button" class="btn btn-outline-primary" @click="startOver">
                  Value another vehicle
                </button>
              </div>

              <form v-else @submit.prevent="onSubmit">
                <h3 class="h5 fw-bold mb-3">Get your trade-in estimate</h3>
                <div class="row g-3">
                  <div class="col-sm-4">
                    <label for="trade-year" class="form-label small fw-semibold">Year</label>
                    <select id="trade-year" v-model="form.year" class="form-select" required>
                      <option value="" disabled>Select</option>
                      <option v-for="year in yearOptions" :key="year" :value="year">
                        {{ year }}
                      </option>
                    </select>
                  </div>
                  <div class="col-sm-4">
                    <label for="trade-make" class="form-label small fw-semibold">Make</label>
                    <input
                      id="trade-make"
                      v-model.trim="form.make"
                      type="text"
                      class="form-control"
                      placeholder="Honda"
                      required
                    />
                  </div>
                  <div class="col-sm-4">
                    <label for="trade-model" class="form-label small fw-semibold">Model</label>
                    <input
                      id="trade-model"
                      v-model.trim="form.model"
                      type="text"
                      class="form-control"
                      placeholder="Civic"
                      required
                    />
                  </div>
                  <div class="col-sm-6">
                    <label for="trade-mileage" class="form-label small fw-semibold">Mileage</label>
                    <input
                      id="trade-mileage"
                      v-model.number="form.mileage"
                      type="number"
                      min="0"
                      class="form-control"
                      placeholder="45000"
                      required
                    />
                  </div>
                  <div class="col-sm-6">
                    <label for="trade-condition" class="form-label small fw-semibold">
                      Condition
                    </label>
                    <select id="trade-condition" v-model="form.condition" class="form-select">
                      <option v-for="option in conditionOptions" :key="option" :value="option">
                        {{ option }}
                      </option>
                    </select>
                  </div>
                  <div class="col-sm-4">
                    <label for="trade-zip" class="form-label small fw-semibold">ZIP code</label>
                    <input
                      id="trade-zip"
                      v-model.trim="form.zip"
                      type="text"
                      inputmode="numeric"
                      pattern="\d{5}"
                      maxlength="5"
                      class="form-control"
                      placeholder="75209"
                      required
                    />
                  </div>
                  <div class="col-sm-8">
                    <label for="trade-email" class="form-label small fw-semibold">Email</label>
                    <input
                      id="trade-email"
                      v-model.trim="form.email"
                      type="email"
                      class="form-control"
                      placeholder="you@example.com"
                      required
                    />
                  </div>
                  <div class="col-12">
                    <button type="submit" class="btn btn-warning btn-lg w-100 fw-semibold">
                      Get my estimate
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.step-number {
  width: 2.25rem;
  height: 2.25rem;
}
</style>
