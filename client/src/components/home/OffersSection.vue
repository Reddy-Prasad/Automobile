<script setup>
import SectionHeading from '@/components/common/SectionHeading.vue'
import { offers } from '@/data/offers'
import { formatDate } from '@/utils/format'

const typeBadgeClass = {
  Finance: 'text-bg-primary',
  'Cash back': 'text-bg-success',
  Lease: 'text-bg-warning',
}
</script>

<template>
  <section id="offers" class="py-5 bg-body-tertiary">
    <div class="container">
      <SectionHeading
        eyebrow="Current offers"
        title="Specials this month"
        subtitle="Manufacturer incentives and dealer savings, updated weekly."
      />

      <div class="row g-4">
        <div v-for="offer in offers" :key="offer.id" class="col-12 col-md-6 col-lg-4">
          <article class="card h-100 border-0 shadow-sm">
            <div class="card-body d-flex flex-column p-4">
              <div class="d-flex justify-content-between align-items-center mb-3">
                <span class="badge" :class="typeBadgeClass[offer.type]">{{ offer.type }}</span>
                <span class="small text-body-secondary">
                  <i class="bi bi-clock me-1"></i>Ends {{ formatDate(offer.expires) }}
                </span>
              </div>
              <p class="small text-uppercase fw-semibold text-body-secondary mb-1">
                {{ offer.vehicle }}
              </p>
              <h3 class="h4 fw-bold text-primary">{{ offer.headline }}</h3>
              <p class="text-body-secondary">{{ offer.details }}</p>
              <RouterLink
                class="btn btn-primary mt-auto align-self-start"
                :to="{ name: 'home', hash: '#contact' }"
              >
                Claim offer<i class="bi bi-arrow-right ms-2"></i>
              </RouterLink>
            </div>
          </article>
        </div>
      </div>

      <p class="small text-body-secondary mt-3 mb-0">
        Offers subject to credit approval and availability. Tax, title, license and dealer fees
        extra. See dealer for complete details.
      </p>
    </div>
  </section>
</template>
