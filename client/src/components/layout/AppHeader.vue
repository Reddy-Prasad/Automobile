<script setup>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { Collapse } from 'bootstrap'
import { dealer } from '@/data/dealer'
import { mainNav } from '@/data/navigation'

const route = useRoute()
const navCollapse = ref(null)

watch(
  () => route.fullPath,
  () => Collapse.getInstance(navCollapse.value)?.hide(),
)
</script>

<template>
  <header>
    <div class="bg-body-tertiary border-bottom small d-none d-md-block">
      <div class="container-fluid px-lg-5 d-flex justify-content-between py-2">
        <span class="text-body-secondary">
          <i class="bi bi-clock me-1"></i>{{ dealer.hoursSummary }}
        </span>
        <div class="d-flex gap-4">
          <a class="link-body-emphasis text-decoration-none" :href="dealer.phoneHref">
            <i class="bi bi-telephone me-1"></i>{{ dealer.phone }}
          </a>
          <RouterLink
            class="link-body-emphasis text-decoration-none"
            :to="{ name: 'home', hash: '#locations' }"
          >
            <i class="bi bi-geo-alt me-1"></i>3 Texas locations
          </RouterLink>
        </div>
      </div>
    </div>

    <nav class="navbar navbar-expand-lg navbar-dark bg-dark sticky-top shadow-sm">
      <div class="container-fluid px-lg-5">
        <RouterLink class="navbar-brand fw-bold" :to="{ name: 'home' }">
          <i class="bi bi-car-front-fill me-2 text-warning"></i>{{ dealer.name }}
        </RouterLink>

        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mainNav"
          aria-controls="mainNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>

        <div id="mainNav" ref="navCollapse" class="collapse navbar-collapse">
          <ul class="navbar-nav ms-auto mb-3 mb-lg-0">
            <li v-for="link in mainNav" :key="link.hash" class="nav-item">
              <RouterLink class="nav-link" :to="{ name: 'home', hash: link.hash }">
                {{ link.label }}
              </RouterLink>
            </li>
          </ul>
          <RouterLink
            class="btn btn-warning fw-semibold ms-lg-3 mb-3 mb-lg-0"
            :to="{ name: 'home', hash: '#contact' }"
          >
            <i class="bi bi-calendar-check me-1"></i>Book a test drive
          </RouterLink>
        </div>
      </div>
    </nav>
  </header>
</template>
