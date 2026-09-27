<script setup>
import { computed } from 'vue'
import { dealer, locations } from '@/data/dealer'
import { mainNav, navLinkTo } from '@/data/navigation'
import { usePublishedStore } from '@/stores/publishedStore'

const currentYear = new Date().getFullYear()
const published = usePublishedStore()
const shopNav = computed(() => published.navigation ?? mainNav)
const contact = computed(() => ({
  blurb: published.footer?.blurb ?? `${dealer.tagline}.`,
  phone: published.footer?.phone ?? dealer.phone,
  phoneHref: published.footer?.phone
    ? `tel:${published.footer.phone.replace(/\D/g, '')}`
    : dealer.phoneHref,
  email: published.footer?.email ?? dealer.email,
  hours: published.footer?.hours ?? dealer.hoursSummary,
}))
</script>

<template>
  <footer class="bg-dark text-white-50 pt-5 pb-4">
    <div class="container">
      <div class="row g-4">
        <div class="col-12 col-lg-4">
          <p class="h5 fw-bold text-white">
            <i class="bi bi-car-front-fill me-2 text-warning"></i>{{ dealer.name }}
          </p>
          <p class="small">{{ contact.blurb }}</p>
          <div class="d-flex gap-3 fs-5">
            <a
              v-for="network in dealer.social"
              :key="network.label"
              class="link-light"
              :href="network.href"
              target="_blank"
              rel="noopener"
              :aria-label="network.label"
            >
              <i :class="['bi', network.icon]"></i>
            </a>
          </div>
        </div>

        <div class="col-6 col-md-4 col-lg-2">
          <p class="text-white fw-semibold mb-2">Shop</p>
          <ul class="list-unstyled small mb-0">
            <li class="mb-1">
              <RouterLink
                class="link-light link-opacity-75 link-opacity-100-hover text-decoration-none"
                :to="{ name: 'vehicles' }"
              >
                Inventory
              </RouterLink>
            </li>
            <li class="mb-1">
              <RouterLink
                class="link-light link-opacity-75 link-opacity-100-hover text-decoration-none"
                :to="{ name: 'saved' }"
              >
                Saved
              </RouterLink>
            </li>
            <li class="mb-1">
              <RouterLink
                class="link-light link-opacity-75 link-opacity-100-hover text-decoration-none"
                :to="{ name: 'compare' }"
              >
                Compare
              </RouterLink>
            </li>
            <li class="mb-1">
              <RouterLink
                class="link-light link-opacity-75 link-opacity-100-hover text-decoration-none"
                :to="{ name: 'requests' }"
              >
                My requests
              </RouterLink>
            </li>
            <li class="mb-1">
              <RouterLink
                class="link-light link-opacity-75 link-opacity-100-hover text-decoration-none"
                :to="{ name: 'account' }"
              >
                Account
              </RouterLink>
            </li>
            <li class="mb-1">
              <RouterLink
                class="link-light link-opacity-75 link-opacity-100-hover text-decoration-none"
                :to="{ name: 'login' }"
              >
                Sign in
              </RouterLink>
            </li>
            <li v-for="link in shopNav" :key="link.label" class="mb-1">
              <RouterLink
                class="link-light link-opacity-75 link-opacity-100-hover text-decoration-none"
                :to="navLinkTo(link)"
              >
                {{ link.label }}
              </RouterLink>
            </li>
          </ul>
        </div>

        <div class="col-6 col-md-4 col-lg-3">
          <p class="text-white fw-semibold mb-2">Locations</p>
          <ul class="list-unstyled small mb-0">
            <li v-for="location in locations" :key="location.id" class="mb-2">
              <span class="d-block text-white">{{ location.name }}</span>
              <a class="link-light link-opacity-75 text-decoration-none" :href="location.phoneHref">
                {{ location.phone }}
              </a>
            </li>
          </ul>
        </div>

        <div class="col-12 col-md-4 col-lg-3">
          <p class="text-white fw-semibold mb-2">Contact</p>
          <p class="small mb-1">
            <i class="bi bi-telephone me-2"></i>
            <a class="link-light text-decoration-none" :href="contact.phoneHref">{{ contact.phone }}</a>
          </p>
          <p class="small mb-1">
            <i class="bi bi-envelope me-2"></i>
            <a class="link-light text-decoration-none" :href="`mailto:${contact.email}`">
              {{ contact.email }}
            </a>
          </p>
          <p class="small mb-0"><i class="bi bi-clock me-2"></i>{{ contact.hours }}</p>
        </div>
      </div>

      <hr class="border-secondary my-4" />

      <div class="d-flex flex-column flex-md-row justify-content-between gap-2 small">
        <span>&copy; {{ currentYear }} {{ dealer.name }}. All rights reserved.</span>
        <span>
          Prices exclude tax, title, license and dealer fees.
          <RouterLink class="link-light link-opacity-75 ms-2" :to="{ name: 'credits' }">
            Photo credits
          </RouterLink>
        </span>
      </div>
    </div>
  </footer>
</template>
