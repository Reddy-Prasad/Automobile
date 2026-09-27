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
      <p class="text-warning small text-uppercase fw-semibold mb-1">CMS app · /cms</p>
      <h1 class="h2 fw-bold">Content workspace</h1>
      <p class="text-white-50 mb-0">
        Signed in as {{ user.name }} · {{ roleName }}. This is a guarded stub, not the Day 10 CMS
        app. Offers and banners stay read-only until that app exists.
      </p>
    </div>
  </section>

  <section class="py-5">
    <div class="container">
      <SectionHeading
        eyebrow="Authorization"
        title="What this role may do"
        subtitle="Authentication already happened. These cards are permission checks on the same user."
      />

      <div class="row g-4">
        <div class="col-md-6">
          <div class="card border-0 shadow-sm h-100">
            <div class="card-body p-4">
              <h2 class="h6 fw-bold">Draft offers</h2>
              <p class="small text-body-secondary">Needs <code>cms.draft</code> (CMS editor).</p>
              <p v-if="authStore.can(PERMISSIONS.CMS_DRAFT)" class="text-success mb-0">
                Allowed. A later CMS screen would POST a draft offer here.
              </p>
              <p v-else class="text-body-secondary mb-0">
                Hidden for this role. A reviewer can read and publish, not draft.
              </p>
            </div>
          </div>
        </div>
        <div class="col-md-6">
          <div class="card border-0 shadow-sm h-100">
            <div class="card-body p-4">
              <h2 class="h6 fw-bold">Publish a banner</h2>
              <p class="small text-body-secondary">Needs <code>cms.publish</code> (CMS reviewer or admin).</p>
              <p v-if="authStore.can(PERMISSIONS.CMS_PUBLISH)" class="text-success mb-0">
                Allowed. Admin has <code>*</code>, so this card is true for them too.
              </p>
              <p v-else class="text-body-secondary mb-0">
                An editor can draft but cannot publish.
              </p>
            </div>
          </div>
        </div>
      </div>

      <p class="small text-body-secondary mt-4 mb-0">
        <RouterLink :to="{ name: 'account' }">Back to account</RouterLink>
        ·
        <RouterLink :to="{ name: 'admin' }">Try Admin</RouterLink>
      </p>
    </div>
  </section>
</template>
