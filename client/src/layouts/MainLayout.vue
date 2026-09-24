<script setup>
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
</script>

<template>
  <div class="d-flex flex-column min-vh-100">
    <AppHeader />

    <main class="flex-grow-1">
      <RouterView />
    </main>

    <AppFooter />
  </div>
</template>
