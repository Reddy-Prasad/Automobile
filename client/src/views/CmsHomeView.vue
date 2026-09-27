<script setup>
import { storeToRefs } from 'pinia'
import SectionHeading from '@/components/common/SectionHeading.vue'
import { PERMISSIONS } from '@/data/roles'
import { useAuthStore } from '@/stores/authStore'

const authStore = useAuthStore()
const { user, roleName } = storeToRefs(authStore)

const cmsUrl = 'http://localhost:5181/cms/login'
</script>

<template>
  <section class="bg-dark text-white py-5">
    <div class="container">
      <p class="text-warning small text-uppercase fw-semibold mb-1">Day 11 · separate app</p>
      <h1 class="h2 fw-bold">CMS lives on port 5181</h1>
      <p class="text-white-50 mb-3">
        Signed in here as {{ user.name }} · {{ roleName }}. This client route is only a doorway.
        Website copy is edited in the CMS Vue app, not on this shopper site.
      </p>
      <a class="btn btn-warning fw-semibold" :href="cmsUrl">Open AutoDrive CMS</a>
    </div>
  </section>

  <section class="py-5">
    <div class="container">
      <SectionHeading
        eyebrow="Why two apps"
        title="Content vs shopping"
        subtitle="The client sells cars. The CMS edits what the client shows. Different users, different deploy cycle."
      />

      <div class="row g-4">
        <div class="col-md-6">
          <div class="card border-0 shadow-sm h-100">
            <div class="card-body p-4">
              <h2 class="h6 fw-bold">Draft offers</h2>
              <p class="small text-body-secondary">Needs <code>cms.draft</code> in the CMS app.</p>
              <p v-if="authStore.can(PERMISSIONS.CMS_DRAFT)" class="text-success mb-0">
                This role may sign in at {{ cmsUrl }} and save drafts.
              </p>
              <p v-else class="text-body-secondary mb-0">
                A reviewer or shopper does not draft copy in the CMS.
              </p>
            </div>
          </div>
        </div>
        <div class="col-md-6">
          <div class="card border-0 shadow-sm h-100">
            <div class="card-body p-4">
              <h2 class="h6 fw-bold">Publish to the homepage</h2>
              <p class="small text-body-secondary">Needs <code>cms.publish</code> (admin in the CMS app).</p>
              <p v-if="authStore.can(PERMISSIONS.CMS_PUBLISH)" class="text-success mb-0">
                Admin can publish. The client then reads <code>/cms-published.json</code>.
              </p>
              <p v-else class="text-body-secondary mb-0">
                An editor drafts. A reviewer approves. Only admin publishes.
              </p>
            </div>
          </div>
        </div>
      </div>

      <p class="small text-body-secondary mt-4 mb-0">
        <RouterLink :to="{ name: 'account' }">Back to account</RouterLink>
        ·
        <RouterLink :to="{ name: 'admin' }">Admin stub (Day 12)</RouterLink>
      </p>
    </div>
  </section>
</template>
