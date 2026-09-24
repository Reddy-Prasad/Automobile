<script setup>
const services = [
  { icon: 'bi-droplet-half', name: 'Oil & filter change', price: 'From $59.95' },
  { icon: 'bi-life-preserver', name: 'Tire rotation & balance', price: 'From $39.95' },
  { icon: 'bi-disc', name: 'Brake inspection', price: 'Free' },
  { icon: 'bi-battery-charging', name: 'Battery test & replace', price: 'From $149' },
  { icon: 'bi-clipboard-check', name: 'Multi-point inspection', price: 'Free' },
  { icon: 'bi-lightning-charge', name: 'EV battery health check', price: 'From $79' },
]

const perks = ['Complimentary Wi-Fi & coffee', 'Loaner vehicles available', 'Online status updates']
</script>

<template>
  <section id="service" class="py-5 bg-body-tertiary">
    <div class="container">
      <div class="row g-5">
        <div class="col-lg-4">
          <p class="text-primary fw-semibold text-uppercase small mb-1">Service &amp; parts</p>
          <h2 class="fw-bold">Keep it running like new</h2>
          <p class="text-body-secondary">
            ASE-certified, factory-trained technicians working on all makes and models, with
            genuine OEM parts.
          </p>
          <ul class="list-unstyled small mb-4">
            <li v-for="perk in perks" :key="perk" class="mb-1">
              <i class="bi bi-check2 text-primary me-2"></i>{{ perk }}
            </li>
          </ul>
          <div class="d-flex flex-wrap gap-2">
            <RouterLink class="btn btn-primary" :to="{ name: 'home', hash: '#contact' }">
              <i class="bi bi-calendar-check me-2"></i>Book service
            </RouterLink>
            <RouterLink class="btn btn-outline-secondary" :to="{ name: 'home', hash: '#locations' }">
              Service hours
            </RouterLink>
          </div>
        </div>

        <div class="col-lg-8">
          <div class="row g-3">
            <div v-for="service in services" :key="service.name" class="col-6 col-md-4">
              <div class="card h-100 border-0 shadow-sm text-center">
                <div class="card-body p-3 p-md-4">
                  <i :class="['bi', service.icon, 'fs-1 text-primary']"></i>
                  <h3 class="h6 fw-bold mt-2 mb-1">{{ service.name }}</h3>
                  <span
                    class="badge"
                    :class="service.price === 'Free' ? 'text-bg-success' : 'text-bg-light border'"
                  >
                    {{ service.price }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
