<script setup>
import { storeToRefs } from 'pinia'
import SectionHeading from '@/components/common/SectionHeading.vue'
import { PERMISSIONS } from '@/data/roles'
import { useAuthStore } from '@/stores/authStore'

const authStore = useAuthStore()
const { user, roleName } = storeToRefs(authStore)
</script>

<template>
  <section class="bg-dark text-white py-5">
    <div class="container">
      <p class="text-warning small text-uppercase fw-semibold mb-1">Admin app · /admin</p>
      <h1 class="h2 fw-bold">Dealer operations</h1>
      <p class="text-white-50 mb-0">
        Signed in as {{ user.name }} · {{ roleName }}. Inventory tables and leads belong in a later
        admin app. Today the route is protected so you can practice guards.
      </p>
    </div>
  </section>

  <section class="py-5">
    <div class="container">
      <SectionHeading
        eyebrow="Authorization"
        title="Role-specific tools"
        subtitle="Same login. Different permissions. Inventory manager ≠ service manager ≠ admin."
      />

      <div class="row g-4">
        <div class="col-md-4">
          <div class="card border-0 shadow-sm h-100">
            <div class="card-body p-4">
              <h2 class="h6 fw-bold">Inventory</h2>
              <p class="small text-body-secondary">Needs <code>inventory.write</code>.</p>
              <p v-if="authStore.can(PERMISSIONS.INVENTORY_WRITE)" class="text-success mb-0">
                Allowed. You would edit stock, price and availability here.
              </p>
              <p v-else class="text-body-secondary mb-0">Not on this role.</p>
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="card border-0 shadow-sm h-100">
            <div class="card-body p-4">
              <h2 class="h6 fw-bold">Service board</h2>
              <p class="small text-body-secondary">Needs <code>service.write</code>.</p>
              <p v-if="authStore.can(PERMISSIONS.SERVICE_WRITE)" class="text-success mb-0">
                Allowed. You would assign technicians and close work orders here.
              </p>
              <p v-else class="text-body-secondary mb-0">Not on this role.</p>
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="card border-0 shadow-sm h-100">
            <div class="card-body p-4">
              <h2 class="h6 fw-bold">All dealer tools</h2>
              <p class="small text-body-secondary">Admin has permission <code>*</code>.</p>
              <p v-if="user.role === 'ADMIN'" class="text-success mb-0">
                You can open CMS and Admin. That is still authorization, not a second login.
              </p>
              <p v-else class="text-body-secondary mb-0">
                Staff see only their slice. Admin is the exception on purpose.
              </p>
            </div>
          </div>
        </div>
      </div>

      <p class="small text-body-secondary mt-4 mb-0">
        <RouterLink :to="{ name: 'account' }">Back to account</RouterLink>
        ·
        <RouterLink :to="{ name: 'cms' }">Try CMS</RouterLink>
      </p>
    </div>
  </section>
</template>
