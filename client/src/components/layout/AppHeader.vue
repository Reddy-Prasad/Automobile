<script setup>
import { ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoute } from 'vue-router'
import { Collapse } from 'bootstrap'
import { dealer } from '@/data/dealer'
import { mainNav, navLinkTo } from '@/data/navigation'
import { useAuthStore } from '@/stores/authStore'
import { useCompareStore } from '@/stores/compareStore'
import { useFavoriteStore } from '@/stores/favoriteStore'

const route = useRoute()
const navCollapse = ref(null)
const authStore = useAuthStore()
const favoriteStore = useFavoriteStore()
const compareStore = useCompareStore()

const { isSignedIn, displayName, status: authStatus } = storeToRefs(authStore)
const { count: favoriteCount } = storeToRefs(favoriteStore)
const { count: compareCount } = storeToRefs(compareStore)

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
            <li class="nav-item">
              <RouterLink
                class="nav-link"
                :class="{
                  active: route.name === 'vehicles' || route.name === 'vehicle-details',
                }"
                :to="{ name: 'vehicles' }"
              >
                Inventory
              </RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink class="nav-link" active-class="active" :to="{ name: 'saved' }">
                Saved
                <span v-if="favoriteCount" class="badge text-bg-warning text-dark ms-1">{{
                  favoriteCount
                }}</span>
              </RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink class="nav-link" active-class="active" :to="{ name: 'compare' }">
                Compare
                <span v-if="compareCount" class="badge text-bg-warning text-dark ms-1">{{
                  compareCount
                }}</span>
              </RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink class="nav-link" active-class="active" :to="{ name: 'requests' }">
                My requests
              </RouterLink>
            </li>
            <li v-for="link in mainNav" :key="link.label" class="nav-item">
              <RouterLink
                class="nav-link"
                :class="{ active: link.name && route.name === link.name }"
                :to="navLinkTo(link)"
              >
                {{ link.label }}
              </RouterLink>
            </li>
          </ul>
          <div class="d-flex flex-column flex-lg-row align-items-lg-center gap-2 ms-lg-3 mb-3 mb-lg-0">
            <button
              v-if="!isSignedIn"
              type="button"
              class="btn btn-outline-light btn-sm"
              :disabled="authStatus === 'loading'"
              @click="authStore.signIn()"
            >
              {{ authStatus === 'loading' ? 'Signing in…' : 'Sign in' }}
            </button>
            <button
              v-else
              type="button"
              class="btn btn-outline-light btn-sm"
              @click="authStore.signOut()"
            >
              {{ displayName }} · Sign out
            </button>
            <RouterLink class="btn btn-warning fw-semibold" :to="{ name: 'home', hash: '#contact' }">
              <i class="bi bi-calendar-check me-1"></i>Book a test drive
            </RouterLink>
          </div>
        </div>
      </div>
    </nav>
  </header>
</template>
