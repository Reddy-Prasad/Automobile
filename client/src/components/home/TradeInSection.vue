<script setup>
const steps = [
  { icon: 'bi-pencil-square', title: 'Tell us about your car', text: 'Year, make, model and mileage.' },
  { icon: 'bi-envelope-check', title: 'Get your estimate', text: 'A specialist replies within 1 business day.' },
  { icon: 'bi-arrow-left-right', title: 'Trade or sell', text: 'Apply it to your next car or take a check.' },
]
</script>

<template>
  <section id="trade-in" class="py-5 bg-dark text-white">
    <div class="container">
      <div class="row g-5 align-items-center">
        <div class="col-lg-6">
          <p class="text-warning fw-semibold text-uppercase small mb-1">Trade-in</p>
          <h2 class="fw-bold">What's your car worth?</h2>
          <p class="text-white-50 mb-4">
            Get a real offer based on local market data, not a guess. No obligation to buy.
          </p>
          <ol class="list-unstyled mb-4">
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
          <RouterLink class="btn btn-warning btn-lg fw-semibold" :to="{ name: 'trade-in' }">
            Start trade-in
          </RouterLink>
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
