<script setup>
import { storeToRefs } from 'pinia'
import SectionHeading from '@/components/common/SectionHeading.vue'
import { PERMISSIONS } from '@/data/roles'
import { useAuthStore } from '@/stores/authStore'

const authStore = useAuthStore()
const { user, roleName } = storeToRefs(authStore)
const adminUrl = 'http://localhost:5182/admin/login'
</script>

<template>
  <section class="bg-dark text-white py-5">
    <div class="container">
      <p class="text-warning small text-uppercase fw-semibold mb-1">Day 12 · separate app</p>
      <h1 class="h2 fw-bold">Admin lives on port 5182</h1>
      <p class="text-white-50 mb-3">
        Signed in here as {{ user.name }} · {{ roleName }}. This client route is a doorway.
        Inventory, leads and bookings are edited in the Admin Vue app, not on this shopper site.
      </p>
      <a class="btn btn-warning fw-semibold" :href="adminUrl">Open AutoDrive Admin</a>
    </div>
  </section>

  <section class="py-5">
    <div class="container">
      <SectionHeading
        eyebrow="Three apps"
        title="Client vs CMS vs Admin"
        subtitle="Shoppers buy. CMS edits copy. Admin runs the dealership."
      />

      <div class="row g-4">
        <div class="col-md-4">
          <div class="card border-0 shadow-sm h-100">
            <div class="card-body p-4">
              <h2 class="h6 fw-bold">Inventory</h2>
              <p class="small text-body-secondary">Needs <code>inventory.write</code> in Admin.</p>
              <p v-if="authStore.can(PERMISSIONS.INVENTORY_WRITE)" class="text-success mb-0">
                This role may create, edit and publish vehicles at {{ adminUrl }}.
              </p>
              <p v-else class="text-body-secondary mb-0">Not this role’s desk.</p>
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="card border-0 shadow-sm h-100">
            <div class="card-body p-4">
              <h2 class="h6 fw-bold">Service board</h2>
              <p class="small text-body-secondary">Needs <code>service.write</code>.</p>
              <p v-if="authStore.can(PERMISSIONS.SERVICE_WRITE)" class="text-success mb-0">
                Allowed on the Admin service board.
              </p>
              <p v-else class="text-body-secondary mb-0">Not on this role.</p>
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="card border-0 shadow-sm h-100">
            <div class="card-body p-4">
              <h2 class="h6 fw-bold">CMS is a different app</h2>
              <p class="small text-body-secondary">Offers and banners are content, not operations.</p>
              <p class="mb-0">
                <a href="http://localhost:5181/cms/login">Open CMS</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
