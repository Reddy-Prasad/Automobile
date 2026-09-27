<script setup>
import { useRoute, useRouter } from 'vue-router'
import FormActions from '@/components/forms/FormActions.vue'
import FormField from '@/components/forms/FormField.vue'
import FormResult from '@/components/forms/FormResult.vue'
import SectionHeading from '@/components/common/SectionHeading.vue'
import { useLoginForm } from '@/composables/useLoginForm'
import { demoAccounts } from '@/data/users'
import { homeRouteName, roleLabel } from '@/data/roles'
import { useAuthStore } from '@/stores/authStore'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const {
  form,
  errors,
  status,
  error,
  submitDisabled,
  isLoading,
  fieldClass,
  submit,
  reset,
  retry,
  simulateError,
} = useLoginForm()

async function onSubmit() {
  const user = await submit()
  if (!user) return
  const redirect = typeof route.query.redirect === 'string' ? route.query.redirect : ''
  await router.replace(redirect || { name: homeRouteName(user.role) })
}

function fillDemo(account) {
  form.email = account.email
  form.password = account.passwordHint
}

async function onRetry() {
  await onSubmit()
}
</script>

<template>
  <section class="bg-body-tertiary border-bottom py-5">
    <div class="container">
      <SectionHeading
        eyebrow="Authentication"
        title="Sign in"
        subtitle="Mock login only. A real .NET API would issue a signed JWT or cookie. This token is a string in sessionStorage."
      />
    </div>
  </section>

  <section class="py-5">
    <div class="container">
      <div class="row g-4">
        <div class="col-lg-6">
          <FormResult
            :status="status === 'error' ? 'error' : 'initial'"
            :error="error"
            title="Signed in"
            @retry="onRetry"
            @reset="reset"
          />

          <form class="card border-0 shadow-sm" novalidate @submit.prevent="onSubmit">
            <div class="card-body p-4">
              <div class="row g-3">
                <div class="col-12">
                  <FormField label="Email" for-id="login-email" :error="errors.email">
                    <input
                      id="login-email"
                      v-model.trim="form.email"
                      type="email"
                      autocomplete="username"
                      :class="fieldClass('email')"
                    />
                  </FormField>
                </div>
                <div class="col-12">
                  <FormField label="Password" for-id="login-password" :error="errors.password">
                    <input
                      id="login-password"
                      v-model="form.password"
                      type="password"
                      autocomplete="current-password"
                      :class="fieldClass('password')"
                    />
                  </FormField>
                </div>
                <div class="col-12">
                  <FormActions
                    :loading="isLoading"
                    :disabled="submitDisabled"
                    submit-label="Sign in (POST /auth/login)"
                    @reset="reset"
                    @fail="simulateError"
                  />
                </div>
              </div>
            </div>
          </form>

          <p class="small text-body-secondary mt-3 mb-0">
            New shopper?
            <RouterLink :to="{ name: 'register' }">Create a customer account</RouterLink>
          </p>
        </div>

        <div class="col-lg-6">
          <div class="card border-0 shadow-sm h-100">
            <div class="card-body p-4">
              <h2 class="h6 fw-bold">Demo accounts</h2>
              <p class="small text-body-secondary">
                Same password for every seed user: <code>{{ demoAccounts[0].passwordHint }}</code>.
                Staff accounts are seeded. Register always creates a <strong>CUSTOMER</strong>.
              </p>
              <div class="list-group list-group-flush">
                <button
                  v-for="account in demoAccounts"
                  :key="account.id"
                  type="button"
                  class="list-group-item list-group-item-action px-0"
                  @click="fillDemo(account)"
                >
                  <span class="fw-semibold">{{ account.name }}</span>
                  <span class="badge text-bg-light border ms-2">{{ roleLabel(account.role) }}</span>
                  <span class="d-block small text-body-secondary">{{ account.email }} → {{ account.app }}</span>
                </button>
              </div>
              <p v-if="authStore.isSignedIn" class="small text-success mt-3 mb-0">
                Signed in as {{ authStore.displayName }} ({{ authStore.roleName }}).
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
