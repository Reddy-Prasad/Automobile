<script setup>
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/authStore'

const route = useRoute()
const authStore = useAuthStore()
const { isSignedIn, roleName, homeName } = storeToRefs(authStore)
</script>

<template>
  <section class="py-5">
    <div class="container" style="max-width: 40rem">
      <p class="text-uppercase small text-danger fw-semibold mb-1">403 · Authorization</p>
      <h1 class="h2 fw-bold">You cannot open this app</h1>
      <p class="lead">
        You are signed in as <strong>{{ roleName }}</strong
        >. That proves <em>authentication</em>. This page is
        <em>authorization</em>: your role is not on the allow-list for
        <code>{{ route.query.from || 'that route' }}</code>.
      </p>
      <p class="text-body-secondary">
        A customer belongs on <code>/account</code>. CMS roles belong on <code>/cms</code>. Dealer
        staff belong on <code>/admin</code>. Signing in again with the same user will not help.
      </p>
      <div class="d-flex flex-wrap gap-2">
        <RouterLink v-if="isSignedIn" class="btn btn-primary" :to="{ name: homeName }">
          Go to your workspace
        </RouterLink>
        <RouterLink v-else class="btn btn-primary" :to="{ name: 'login' }">Sign in</RouterLink>
        <RouterLink class="btn btn-outline-secondary" :to="{ name: 'home' }">Home</RouterLink>
      </div>
    </div>
  </section>
</template>
