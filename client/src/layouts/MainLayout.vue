<script setup>
import ApiLogBar from '@/components/common/ApiLogBar.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import AppHeader from '@/components/layout/AppHeader.vue'
</script>

<template>
  <div class="d-flex flex-column min-vh-100">
    <a class="skip-link btn btn-primary visually-hidden-focusable" href="#main-content">
      Skip to main content
    </a>
    <AppHeader />

    <main id="main-content" class="flex-grow-1" tabindex="-1">
      <RouterView />
    </main>

    <ApiLogBar />
    <AppFooter />
  </div>
</template>
