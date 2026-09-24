<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { Carousel } from 'bootstrap'

const slides = [
  {
    id: 'rav4',
    theme: 'hero-slide--navy',
    icon: 'bi-car-front-fill',
    eyebrow: 'Offer of the month',
    title: '2026 Toyota RAV4 Hybrid at 1.9% APR',
    text: 'Up to 41 city mpg, standard AWD and Toyota Safety Sense 3.0. Financing for 60 months on approved credit.',
    primary: { label: 'Shop new SUVs', hash: '#new-vehicles' },
    secondary: { label: 'See all offers', hash: '#offers' },
  },
  {
    id: 'cpo',
    theme: 'hero-slide--green',
    icon: 'bi-patch-check-fill',
    eyebrow: 'Certified Pre-Owned',
    title: 'Certified quality. Pre-owned price.',
    text: '172-point inspection, a 12-month/12,000-mile limited warranty and roadside assistance on every certified vehicle.',
    primary: { label: 'Shop used vehicles', hash: '#used-vehicles' },
    secondary: { label: 'Value my trade', hash: '#trade-in' },
  },
  {
    id: 'service',
    theme: 'hero-slide--charcoal',
    icon: 'bi-tools',
    eyebrow: 'Service center',
    title: 'Oil change and tire rotation from $59.95',
    text: 'Factory-trained technicians, genuine parts and a free multi-point inspection. Most visits done in under an hour.',
    primary: { label: 'Book service', hash: '#service' },
    secondary: { label: 'Find a location', hash: '#locations' },
  },
]

const AUTO_ADVANCE_MS = 5500

const carouselEl = ref(null)
let carousel = null

onMounted(() => {
  Carousel.getInstance(carouselEl.value)?.dispose()
  carousel = new Carousel(carouselEl.value, {
    interval: AUTO_ADVANCE_MS,
    ride: 'carousel',
    pause: 'hover',
    wrap: true,
    keyboard: true,
  })
  carousel.cycle()
})

onBeforeUnmount(() => {
  carousel?.dispose()
})
</script>

<template>
  <section aria-label="Featured promotions">
    <div
      id="heroCarousel"
      ref="carouselEl"
      class="carousel slide carousel-fade"
      data-bs-ride="carousel"
      :data-bs-interval="AUTO_ADVANCE_MS"
    >
      <div class="carousel-indicators">
        <button
          v-for="(slide, index) in slides"
          :key="slide.id"
          type="button"
          data-bs-target="#heroCarousel"
          :data-bs-slide-to="index"
          :class="{ active: index === 0 }"
          :aria-current="index === 0 ? 'true' : undefined"
          :aria-label="`Slide ${index + 1}: ${slide.eyebrow}`"
        ></button>
      </div>

      <div class="carousel-inner">
        <div
          v-for="(slide, index) in slides"
          :key="slide.id"
          class="carousel-item"
          :class="{ active: index === 0 }"
        >
          <div class="hero-slide d-flex align-items-center text-white" :class="slide.theme">
            <div class="container py-5">
              <div class="row align-items-center">
                <div class="col-lg-7 px-4 px-lg-3">
                  <span class="badge text-bg-warning text-uppercase mb-3">{{ slide.eyebrow }}</span>
                  <h2 class="display-5 fw-bold mb-3">{{ slide.title }}</h2>
                  <p class="lead text-white-50 mb-4">{{ slide.text }}</p>
                  <div class="d-flex flex-column flex-sm-row gap-2">
                    <RouterLink
                      class="btn btn-light btn-lg"
                      :to="{ name: 'home', hash: slide.primary.hash }"
                    >
                      {{ slide.primary.label }}
                    </RouterLink>
                    <RouterLink
                      class="btn btn-outline-light btn-lg"
                      :to="{ name: 'home', hash: slide.secondary.hash }"
                    >
                      {{ slide.secondary.label }}
                    </RouterLink>
                  </div>
                </div>
                <div class="col-lg-5 d-none d-lg-block text-center">
                  <i :class="['bi', slide.icon, 'hero-icon']"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <button
        class="carousel-control-prev d-none d-md-flex"
        type="button"
        data-bs-target="#heroCarousel"
        data-bs-slide="prev"
      >
        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Previous</span>
      </button>
      <button
        class="carousel-control-next d-none d-md-flex"
        type="button"
        data-bs-target="#heroCarousel"
        data-bs-slide="next"
      >
        <span class="carousel-control-next-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Next</span>
      </button>
    </div>
  </section>
</template>

<style scoped>
.hero-slide {
  min-height: 460px;
  padding-bottom: 2rem;
}

@media (min-width: 992px) {
  .hero-slide {
    min-height: 520px;
  }
}

.hero-slide--navy {
  background: linear-gradient(120deg, #0b1d3a 0%, #13396b 60%, #1d5fa8 100%);
}

.hero-slide--green {
  background: linear-gradient(120deg, #0f2a1d 0%, #1b4d33 60%, #2f7a50 100%);
}

.hero-slide--charcoal {
  background: linear-gradient(120deg, #1a1a1d 0%, #34343a 60%, #5a2a27 100%);
}

.hero-icon {
  font-size: 14rem;
  color: rgb(255 255 255 / 0.15);
}
</style>
