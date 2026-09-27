<script setup>
import { storeToRefs } from 'pinia'
import SectionHeading from '@/components/common/SectionHeading.vue'
import { PERMISSIONS, roleLabel } from '@/data/roles'
import { useAuthStore } from '@/stores/authStore'

const authStore = useAuthStore()
const { user, roleName, homeName, token } = storeToRefs(authStore)
</script>

<template>
  <section class="bg-body-tertiary border-bottom py-5">
    <div class="container">
      <SectionHeading
        eyebrow="Client app · /account"
        title="Your account"
        subtitle="You are authenticated. What you can open next is authorization — role and permissions, not just a signed-in flag."
      />
    </div>
  </section>

  <section class="py-5">
    <div class="container">
      <div class="row g-4">
        <div class="col-lg-7">
          <div class="card border-0 shadow-sm">
            <div class="card-body p-4">
              <p class="small text-uppercase text-body-secondary mb-1">Current user · GET /auth/me</p>
              <h2 class="h4 fw-bold mb-1">{{ user.name }}</h2>
              <p class="mb-3">
                {{ user.email }}
                <span class="badge text-bg-primary ms-2">{{ roleName }}</span>
              </p>
              <p class="small text-body-secondary mb-2">Permissions for this role</p>
              <ul class="mb-0">
                <li v-for="permission in user.permissions" :key="permission">
                  <code>{{ permission }}</code>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div class="col-lg-5">
          <div class="card border-0 shadow-sm mb-4">
            <div class="card-body p-4">
              <h2 class="h6 fw-bold">Session (this tab)</h2>
              <p class="small text-body-secondary">
                The mock token lives in <code>sessionStorage</code>. Close the tab and it is gone.
                Refresh keeps seed users because the mock token includes the user id. A newly
                registered user is lost if the tab fully reloads — there is no real database.
              </p>
              <p class="small mb-0">
                Token (not a real JWT):
                <code class="d-block text-break mt-1">{{ token }}</code>
              </p>
            </div>
          </div>

          <div class="d-grid gap-2">
            <RouterLink v-if="homeName !== 'account'" class="btn btn-primary" :to="{ name: homeName }">
              Open your workspace
            </RouterLink>
            <RouterLink class="btn btn-outline-primary" :to="{ name: 'requests' }">
              My requests
            </RouterLink>
            <RouterLink
              v-if="authStore.can(PERMISSIONS.CMS_READ)"
              class="btn btn-outline-secondary"
              :to="{ name: 'cms' }"
            >
              CMS
            </RouterLink>
            <RouterLink
              v-if="authStore.can(PERMISSIONS.ADMIN_READ)"
              class="btn btn-outline-secondary"
              :to="{ name: 'admin' }"
            >
              Admin
            </RouterLink>
          </div>
        </div>
      </div>

      <p class="small text-body-secondary mt-4 mb-0">
        Try opening <RouterLink :to="{ name: 'admin' }">/admin</RouterLink> or
        <RouterLink :to="{ name: 'cms' }">/cms</RouterLink> as this user. A customer should land on
        Forbidden — that is authorization, not a failed login.
      </p>
    </div>
  </section>
</template>
