<script setup>
import { useRouter } from 'vue-router'
import FormActions from '@/components/forms/FormActions.vue'
import FormField from '@/components/forms/FormField.vue'
import FormResult from '@/components/forms/FormResult.vue'
import SectionHeading from '@/components/common/SectionHeading.vue'
import { useRegisterForm } from '@/composables/useRegisterForm'

const router = useRouter()

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
} = useRegisterForm()

async function onSubmit() {
  const user = await submit()
  if (!user) return
  await router.replace({ name: 'account' })
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
        title="Create a customer account"
        subtitle="Register always assigns the CUSTOMER role. CMS and admin users are seeded — a real .NET API would have an invite or admin-created staff user."
      />
    </div>
  </section>

  <section class="py-5">
    <div class="container" style="max-width: 36rem">
      <FormResult
        :status="status === 'error' ? 'error' : 'initial'"
        :error="error"
        title="Account created"
        @retry="onRetry"
        @reset="reset"
      />

      <form class="card border-0 shadow-sm" novalidate @submit.prevent="onSubmit">
        <div class="card-body p-4">
          <div class="row g-3">
            <div class="col-12">
              <FormField label="Name" for-id="reg-name" :error="errors.name">
                <input id="reg-name" v-model.trim="form.name" :class="fieldClass('name')" />
              </FormField>
            </div>
            <div class="col-12">
              <FormField label="Email" for-id="reg-email" :error="errors.email">
                <input
                  id="reg-email"
                  v-model.trim="form.email"
                  type="email"
                  autocomplete="email"
                  :class="fieldClass('email')"
                />
              </FormField>
            </div>
            <div class="col-md-6">
              <FormField label="Password" for-id="reg-password" :error="errors.password">
                <input
                  id="reg-password"
                  v-model="form.password"
                  type="password"
                  autocomplete="new-password"
                  :class="fieldClass('password')"
                />
              </FormField>
            </div>
            <div class="col-md-6">
              <FormField label="Confirm password" for-id="reg-confirm" :error="errors.confirm">
                <input
                  id="reg-confirm"
                  v-model="form.confirm"
                  type="password"
                  autocomplete="new-password"
                  :class="fieldClass('confirm')"
                />
              </FormField>
            </div>
            <div class="col-12">
              <FormActions
                :loading="isLoading"
                :disabled="submitDisabled"
                submit-label="Create account (POST /auth/register)"
                @reset="reset"
                @fail="simulateError"
              />
            </div>
          </div>
        </div>
      </form>

      <p class="small text-body-secondary mt-3 mb-0">
        Already have an account?
        <RouterLink :to="{ name: 'login' }">Sign in</RouterLink>
      </p>
    </div>
  </section>
</template>
