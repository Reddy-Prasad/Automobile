<script setup>
import SectionHeading from '@/components/common/SectionHeading.vue'
import { locations } from '@/data/dealer'

function directionsUrl(location) {
  const address = `${location.street}, ${location.city}, ${location.state} ${location.zip}`
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`
}
</script>

<template>
  <section id="locations" class="py-5">
    <div class="container">
      <SectionHeading
        eyebrow="Visit us"
        title="Three Texas locations"
        subtitle="Sales, service and parts, open seven days a week at most stores."
        centered
      />

      <div class="row g-4">
        <div v-for="location in locations" :key="location.id" class="col-12 col-md-6 col-lg-4">
          <article class="card h-100 shadow-sm">
            <div class="card-body d-flex flex-column p-4">
              <h3 class="h5 fw-bold">{{ location.name }}</h3>
              <address class="text-body-secondary mb-2">
                <i class="bi bi-geo-alt me-1"></i>{{ location.street }}<br />
                <span class="ms-4">{{ location.city }}, {{ location.state }} {{ location.zip }}</span>
              </address>
              <a class="link-body-emphasis text-decoration-none mb-3" :href="location.phoneHref">
                <i class="bi bi-telephone me-1"></i>{{ location.phone }}
              </a>

              <div class="d-flex flex-wrap gap-1 mb-3">
                <span
                  v-for="department in location.departments"
                  :key="department"
                  class="badge rounded-pill bg-primary-subtle text-primary-emphasis"
                >
                  {{ department }}
                </span>
              </div>

              <dl class="small row mb-4">
                <template v-for="entry in location.hours" :key="entry.days">
                  <dt class="col-5 fw-semibold">{{ entry.days }}</dt>
                  <dd class="col-7 mb-1" :class="{ 'text-danger': entry.time === 'Closed' }">
                    {{ entry.time }}
                  </dd>
                </template>
              </dl>

              <div class="d-flex gap-2 mt-auto">
                <a
                  class="btn btn-primary flex-grow-1"
                  :href="directionsUrl(location)"
                  target="_blank"
                  rel="noopener"
                >
                  <i class="bi bi-map me-1"></i>Directions
                </a>
                <a class="btn btn-outline-primary flex-grow-1" :href="location.phoneHref">
                  <i class="bi bi-telephone me-1"></i>Call
                </a>
              </div>
            </div>
          </article>
        </div>
      </div>
    </div>
  </section>
</template>
