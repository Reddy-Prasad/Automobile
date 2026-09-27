<script setup>
import { reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import FormField from '@/components/FormField.vue'
import { demoAccounts } from '@/data/users'
import { roleLabel } from '@/data/roles'
import { useAuthStore } from '@/stores/authStore'
import { validateLogin } from '@/utils/validate'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const form = reactive({ email: '', password: '' })
const errors = reactive({ email: '', password: '' })
const submitting = ref(false)

function fillDemo(account) {
  form.email = account.email
  form.password = account.passwordHint
}

async function onSubmit() {
  const next = validateLogin(form)
  errors.email = next.email ?? ''
  errors.password = next.password ?? ''
  if (errors.email || errors.password) return

  submitting.value = true
  try {
    await authStore.login({ email: form.email, password: form.password })
    const redirect = typeof route.query.redirect === 'string' ? route.query.redirect : ''
    await router.replace(redirect || { name: 'dashboard' })
  } catch {
    // authStore.error holds the message
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div class="min-vh-100 bg-body-tertiary d-flex align-items-center py-5">
    <div class="container">
      <div class="row justify-content-center g-4">
        <div class="col-lg-5">
          <p class="small text-uppercase text-primary fw-semibold mb-1">Operations app</p>
          <h1 class="h2 fw-bold">Sign in to AutoDrive Admin</h1>
          <p class="text-body-secondary">
            This app manages the lot and the desk: inventory, leads, bookings, users. Offers and
            banners stay in the CMS. Shoppers stay on the client site.
          </p>

          <div v-if="authStore.error" class="alert alert-danger">{{ authStore.error.message }}</div>

          <form class="card border-0 shadow-sm" novalidate @submit.prevent="onSubmit">
            <div class="card-body p-4">
              <div class="mb-3">
                <FormField label="Email" for-id="admin-email" :error="errors.email">
                  <input
                    id="admin-email"
                    v-model.trim="form.email"
                    type="email"
                    class="form-control"
                    :class="{ 'is-invalid': errors.email }"
                    autocomplete="username"
                  />
                </FormField>
              </div>
              <div class="mb-4">
                <FormField label="Password" for-id="admin-password" :error="errors.password">
                  <input
                    id="admin-password"
                    v-model="form.password"
                    type="password"
                    class="form-control"
                    :class="{ 'is-invalid': errors.password }"
                    autocomplete="current-password"
                  />
                </FormField>
              </div>
              <button class="btn btn-primary w-100" type="submit" :disabled="submitting">
                {{ submitting ? 'Signing in…' : 'Sign in' }}
              </button>
            </div>
          </form>
        </div>

        <div class="col-lg-5">
          <div class="card border-0 shadow-sm">
            <div class="card-body p-4">
              <h2 class="h5">Demo staff</h2>
              <p class="small text-body-secondary">
                Password <code>Password1!</code>. Inventory manager owns the lot. Service manager
                owns the shop. Admin sees everything.
              </p>
              <button
                v-for="account in demoAccounts"
                :key="account.email"
                type="button"
                class="btn btn-outline-secondary w-100 mb-2 text-start"
                @click="fillDemo(account)"
              >
                <span class="fw-semibold">{{ account.name }}</span>
                <span class="d-block small">{{ roleLabel(account.role) }} · {{ account.email }}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
